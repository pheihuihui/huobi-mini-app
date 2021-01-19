import { huobiwss } from "../shared/constants"
import { ISub, IPing, IPong, IUnsub } from "../shared/meta"
import nWebSocket from 'ws'
import { gunzip } from 'zlib'
import ncron from 'node-cron'
import { createNewRestRequestFromNode } from "./request"
import { TPromiseRespV1, TResp_market_tickers } from "../shared/meta_response"
import { added, removed, topSymbols, toSubscriptionStr } from "../shared/helper"
import { MarketObserver } from "./observer"
import { TTick } from "../shared/meta_socket"

export let n_hbsocket: nWebSocket
export let top10: string[] = []

const cron = ncron.schedule('1 * * * * *', () => {
    createNewRestRequestFromNode('/market/tickers', {})
        .then(x => x.json() as TPromiseRespV1<TResp_market_tickers>)
        .then(x => {
            let subs = topSymbols(x.data, 10).map(v => toSubscriptionStr(v.symbol, '1day'))
            let addedSubs = added(top10, subs)
            let removedSubs = removed(top10, subs)
            top10 = subs
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

const observer = MarketObserver.getInstance()

export function openNodeWebSocket() {
    n_hbsocket = new nWebSocket(huobiwss)

    n_hbsocket.onopen = () => {
        cron.start()
        observer.attachStrategyOnRise((symbol, price, time) => {
            console.log(`rising...\n`)
        })
        observer.attachStrategyOnFall((symbol, price, time) => {
            console.log(`falling...\n`)
        })
    }

    n_hbsocket.onclose = () => {
        cron.stop()
        observer.removeAllStrategies()
    }

    n_hbsocket.onmessage = async (event) => {
        let dt = event.data as ArrayBuffer
        gunzip(dt, (err, res) => {
            let str = res.toString()
            let obj = JSON.parse(str)
            if (obj.ping) {
                let pong: IPong = { pong: obj.ping }
                n_hbsocket.send(JSON.stringify(pong))
            }
            if (obj.tick) {
                let ts = obj.ts as number
                let ch = obj.ch as string
                let symbol = ch.split('.')[1]
                observer.update(ts, symbol, obj.tick as TTick)
            }
        })
    }
}