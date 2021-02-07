import ncron from 'node-cron'
import { topSymbols, toSubscriptionStr, added, removed, sleep, tickersSinceLastMinute } from '../shared/helper'
import { ISub, IUnsub } from '../shared/meta'
import { globals } from './global'
import { update_currencys, write_logs, write_tops } from './mongo_client'
import { observer } from './observer'
import { retrieveHuobiResponse } from './request'
import { n_hbsocket } from './socket_node'
import { allIn } from './trader'

export const cron_every_minute = ncron.schedule('59 * * * * *', async () => {
    let resp1 = await retrieveHuobiResponse('/market/tickers', {})
    await sleep(1000)
    let resp2 = await retrieveHuobiResponse('/market/tickers', {})
    let tickers = tickersSinceLastMinute(resp1.data, resp2.data)
    let top1 = topSymbols(tickers, 1)[0]
    console.log(top1)
    let sub = toSubscriptionStr(top1.symbol, '1min')
    if (top1.sharp) {
        let subReq: ISub = {
            sub: sub,
            id: 'myid'
        }
        let unSubReq: IUnsub = {
            unsub: sub,
            id: 'myid'
        }
        n_hbsocket.send(JSON.stringify(subReq))
        observer.attachStrategyOnWatching((symbol, price, time) => {
            if (symbol == top1.symbol) {
                top1.fluctuation![time] = price
            }
        })
        setTimeout(() => {
            n_hbsocket.send(JSON.stringify(unSubReq))
            observer.removeStrategiesOnWatching()
            console.log(top1)
        }, 10000);
    }


    // let addedSubs = added(globals.top10, subs)
    // let removedSubs = removed(globals.top10, subs)
    // globals.top10 = subs
    // addedSubs.forEach(v => {
    //     let req: ISub = {
    //         sub: v,
    //         id: 'myid'
    //     }
    //     n_hbsocket.send(JSON.stringify(req))
    // })
    // removedSubs.forEach(v => {
    //     let req: IUnsub = {
    //         unsub: v,
    //         id: 'myid'
    //     }
    //     n_hbsocket.send(JSON.stringify(req))
    // })

})

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
})
