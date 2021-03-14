import ncron from 'node-cron'
import { topSymbols, toSubscriptionStr, added, removed, sleep, tickersSinceLastTime } from '../shared/helper'
import { ISub, IUnsub } from '../shared/meta'
import { globals } from './global'
import { TBaseCoin, TSymbolBoard } from './meta_mongo'
import { update_currencys, write_logs, write_symbols, write_tops } from './mongo_client'
import { observer } from './observer'
import { retrieveHuobiResponse } from './request'
import { n_hbsocket, openNodeWebSocket } from './socket_node'
import { allIn } from './trader'

// const every_minute = async () => {
//     let resp1 = await retrieveHuobiResponse('/market/tickers', {})
//     await sleep(1000)
//     let resp2 = await retrieveHuobiResponse('/market/tickers', {})
//     let tickers = tickersSinceLastTime(resp1.data, resp2.data)
//     let top1 = topSymbols(tickers, 1)[0]
//     let sub = toSubscriptionStr(top1.symbol, '1min')
//     if (top1.sharp) {
//         let subReq: ISub = {
//             sub: sub,
//             id: 'myid'
//         }
//         let unSubReq: IUnsub = {
//             unsub: sub,
//             id: 'myid'
//         }
//         n_hbsocket.send(JSON.stringify(subReq))
//         observer.attachStrategyOnWatching((symbol, price, time) => {
//             if (symbol == top1.symbol) {
//                 top1.fluctuation![time] = price
//             }
//         })
//         setTimeout(() => {
//             n_hbsocket.send(JSON.stringify(unSubReq))
//             observer.removeStrategiesOnWatching()
//             console.log(top1)
//         }, 20000);
//     }
// }

// export const cron_every_minute_59 = ncron.schedule('59 * * * * *', every_minute)
// export const cron_every_minute_19 = ncron.schedule('19 * * * * *', every_minute)
// export const cron_every_minute_39 = ncron.schedule('39 * * * * *', every_minute)

export const cron_checkSocket = ncron.schedule('0 * * * * *', () => {
    if (n_hbsocket && n_hbsocket.readyState == n_hbsocket.CONNECTING || n_hbsocket.readyState == n_hbsocket.OPEN) {
        return
    } else {
        openNodeWebSocket()
    }
}, { scheduled: false })

export const cron_every_10sec = ncron.schedule('*/10 * * * * *', () => {
    console.log('update all...')
    observer.updateAll()
}, { scheduled: false })

export const cron_every_hour = ncron.schedule('0 0 * * * *', () => {
    retrieveHuobiResponse('/v1/common/currencys', {})
        .then(x => {
            let curs = x.data
            let curs_count = curs.length
            let addedCurs: string[] = []
            let removedCurs: string[] = []
            if (curs_count > globals.currencysCount) {
                addedCurs = added(globals.currencys, curs)
                allIn(addedCurs[0])
            } else {
                let addedCurs = added(globals.currencys, curs)
                if (addedCurs.length > 0) {
                    allIn(addedCurs[0])
                }
            }
            removedCurs = removed(globals.currencys, curs)
            let unchanged = removedCurs.length == 0 && addedCurs.length == 0
            if (!unchanged) {
                globals.currencysCount = curs_count
                globals.currencys = curs
                update_currencys({
                    length: curs_count,
                    all_currencys: curs,
                    added_currencys: addedCurs,
                    removed_currencys: removedCurs
                })
            } else {
                write_logs('no currencies udpate')
            }
        })
}, { scheduled: false })

export const cron_every_day = ncron.schedule('0 0 0 * * *', () => {
    retrieveAllSymbols()
}, { scheduled: false })

export function retrieveAllSymbols() {
    retrieveHuobiResponse('/v1/common/symbols', {})
        .then(x => {
            let sbs = x.data
            let res: TSymbolBoard = {}
            sbs.forEach(v => {
                let quote = v['quote-currency']
                let base = v['base-currency'] as TBaseCoin
                if (!res[quote]) {
                    res[quote] = {}
                }
                res[quote][base] = {
                    maxOrderValue: v['max-order-value'],
                    minOrderValue: v['min-order-value']
                }
            })
            write_symbols(res)
        })
}
