import { huobiwss } from "../shared/constants"
import { ISub, IPing, IPong, IUnsub } from "../shared/meta"
import nWebSocket from 'ws'
import { gunzip } from 'zlib'
import { TPromiseRespV1, TResp_market_tickers } from "../shared/meta_response"
import { added, removed, topSymbols, toSubscriptionStr } from "../shared/helper"
import { MarketObserver } from "./observer"
import { TTick } from "../shared/meta_socket"

export let n_hbsocket: nWebSocket

const observer = MarketObserver.getInstance()

export function openNodeWebSocket() {
    n_hbsocket = new nWebSocket(huobiwss)

    n_hbsocket.onopen = () => {
        // cron.start()
        observer.attachStrategyOnRise((symbol, price, time) => {
            console.log(`rising...\n\t${symbol}\n\t${price}\n\t${time}\n`)
        })
        observer.attachStrategyOnFall((symbol, price, time) => {
            console.log(`falling...\n\t${symbol}\n\t${price}\n\t${time}\n`)
        })
    }

    n_hbsocket.onclose = () => {
        // cron.stop()
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