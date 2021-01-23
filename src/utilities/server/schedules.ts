import ncron from 'node-cron'
import { topSymbols, toSubscriptionStr, added, removed } from '../shared/helper'
import { ISub, IUnsub } from '../shared/meta'
import { TPromiseRespV1, TResp_market_tickers, TResp_v1_common_currencys } from '../shared/meta_response'
import { global } from './global'
import { update_currencys, write_logs } from './mongo_client'
import { retrieveHuobiResponse } from './request'
import { n_hbsocket } from './socket_node'
import { allIn } from './trader'

export const cron_every_minute = ncron.schedule('30 * * * * *', () => {
    retrieveHuobiResponse('/market/tickers', {})
        .then(x => {
            let subs = topSymbols(x.data, 10).map(v => toSubscriptionStr(v.symbol, '1day'))
            let addedSubs = added(global.top10, subs)
            let removedSubs = removed(global.top10, subs)
            global.top10 = subs
            addedSubs.forEach(v => {
                let req: ISub = {
                    sub: v,
                    id: 'myid'
                }
                n_hbsocket.send(JSON.stringify(req))
            })
            removedSubs.forEach(v => {
                let req: IUnsub = {
                    unsub: v,
                    id: 'myid'
                }
                n_hbsocket.send(JSON.stringify(req))
            })
        })
})

export const cron_every_hour = ncron.schedule('0 0 * * * *', () => {
    retrieveHuobiResponse('/v1/common/currencys', {})
        .then(x => {
            let curs = x.data
            let curs_count = curs.length
            let addedCurs: string[] = []
            let removedCurs: string[] = []
            if (curs_count > global.currencysCount) {
                addedCurs = added(global.currencys, curs)
                allIn(addedCurs[0])
            } else {
                let addedCurs = added(global.currencys, curs)
                if (addedCurs.length > 0) {
                    allIn(addedCurs[0])
                }
            }
            removedCurs = removed(global.currencys, curs)
            let unchanged = removedCurs.length == 0 && addedCurs.length == 0
            if (!unchanged) {
                global.currencysCount = curs_count
                global.currencys = curs
                update_currencys({
                    ts: Date.now(),
                    length: curs_count,
                    currencys: curs,
                    added: addedCurs,
                    removed: removedCurs
                })
            } else {
                write_logs('no currencies udpate')
            }
        })
})
