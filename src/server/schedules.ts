import ncron from 'node-cron'
import { topSymbols, toSubscriptionStr, added, removed, sleep, tickersSinceLastMinute } from '../shared/helper'
import { ISub, IUnsub } from '../shared/meta'
import { globals } from './global'
import { update_currencys, write_logs, write_tops } from './mongo_client'
import { retrieveHuobiResponse } from './request'
import { n_hbsocket } from './socket_node'
import { allIn } from './trader'

export const cron_every_minute = ncron.schedule('0 * * * * *', async () => {
    await sleep(100)
    let resp = await retrieveHuobiResponse('/market/tickers', {})
    let tickers = tickersSinceLastMinute(globals.previousTickers, resp.data)
    let tops = topSymbols(tickers, 3)
    let subs = tops.map(x => toSubscriptionStr(x.symbol, '1min'))
    globals.previousTickers = resp.data
    await write_tops(tops)
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
