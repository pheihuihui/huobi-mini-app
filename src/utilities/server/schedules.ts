import ncron from 'node-cron'
import { topSymbols, toSubscriptionStr, added, removed } from '../shared/helper'
import { ISub, IUnsub } from '../shared/meta'
import { TPromiseRespV1, TResp_market_tickers, TResp_v1_common_currencys } from '../shared/meta_response'
import { globalStatus } from './global'
import { update_allCurrencys, write_logs } from './mongo_client'
import { createNewRestRequestFromNode } from './request'
import { n_hbsocket } from './socket_node'
import { allIn } from './trader'

export const cron_every_minute = ncron.schedule('0 * * * * *', () => {
    createNewRestRequestFromNode('/market/tickers', {})
        .then(x => x.json() as TPromiseRespV1<TResp_market_tickers>)
        .then(x => {
            let subs = topSymbols(x.data, 10).map(v => toSubscriptionStr(v.symbol, '1day'))
            let addedSubs = added(globalStatus.top10, subs)
            let removedSubs = removed(globalStatus.top10, subs)
            globalStatus.top10 = subs
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
    createNewRestRequestFromNode('/v1/common/currencys', {})
        .then(x => x.json() as TPromiseRespV1<TResp_v1_common_currencys>)
        .then(x => {
            let curs = x.data
            let curs_count = curs.length
            let addedCurs: string[] = []
            let removedCurs: string[] = []
            if (curs_count > globalStatus.currencysCount) {
                addedCurs = added(globalStatus.currencys, curs)
                allIn(addedCurs[0])
            } else {
                let addedCurs = added(globalStatus.currencys, curs)
                if (addedCurs.length > 0) {
                    allIn(addedCurs[0])
                }
            }
            removedCurs = removed(globalStatus.currencys, curs)
            let unchanged = removedCurs.length == 0 && addedCurs.length == 0
            if (!unchanged) {
                globalStatus.currencysCount = curs_count
                globalStatus.currencys = curs
                update_allCurrencys({ ts: Date.now(), currencys: curs, length: curs_count })
            } else {
                write_logs('no currencies udpate')
            }
        })
})
