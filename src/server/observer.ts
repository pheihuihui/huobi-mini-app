import { EventEmitter } from "events";
import { tickersSinceLastTime, topSymbols, toSubscriptionStr } from "../shared/helper";
import { ISub, IUnsub } from "../shared/meta";
import { TResp_market_tickers } from "../shared/meta_response";
import { TTick } from "../shared/meta_socket";
import { write_top1, write_top1_async } from "./mongo_client";
import { retrieveHuobiResponse } from "./request";
import { n_hbsocket } from "./socket_node";

class MarketObserver {
    private static observer: MarketObserver

    private onRise: EventEmitter
    private onFall: EventEmitter
    private onWatching: EventEmitter

    private lastTick: TResp_market_tickers
    private lastTickTime: number
    private tickTimeGap: number

    private constructor(gap?: number) {
        this.onRise = new EventEmitter()
        this.onFall = new EventEmitter()
        this.onWatching = new EventEmitter()
        this.lastTick = []
        this.lastTickTime = 0
        if (gap) {
            this.tickTimeGap = gap
        } else {
            this.tickTimeGap = 10000
        }
    }

    static getInstance() {
        if (!MarketObserver.observer) {
            MarketObserver.observer = new MarketObserver()
        }
        return MarketObserver.observer
    }

    update(time: number, symbol: string, tick: TTick) {
        // for (const key in this.prices) {
        //     if (Object.prototype.hasOwnProperty.call(this.prices, key)) {
        //         const element = this.prices[key]
        //         let last = element.getLastUpdateTime()
        //         if (time - last > this.timeGap && symbol != key) {
        //             delete this.prices[key]
        //         }
        //     }
        // }
        // if (this.prices[symbol]) {
        //     this.prices[symbol].push(time, tick.close)
        // } else {
        //     let queue = new PriceQueue(5, this.growthRate, this.reductionRate)
        //     queue.push(time, tick.close)
        //     this.prices[symbol] = queue
        // }
        // for (const key in this.prices) {
        //     if (Object.prototype.hasOwnProperty.call(this.prices, key)) {
        //         const element = this.prices[key]
        //         if (element.getState() == 'rising') {
        //             this.onRise.emit('buy', key, tick.close, time)
        //         }
        //         if (element.getState() == 'falling') {
        //             this.onFall.emit('sell', key, tick.close, time)
        //         }
        //     }
        // }
        this.onWatching.emit('watch', symbol, tick.close, time)
    }

    async updateAll() {
        let resp = await retrieveHuobiResponse('/market/tickers', {})
        let ts = Date.now()
        let dt = resp.data
        let shortticker = tickersSinceLastTime(this.lastTick, dt)
        let tops = topSymbols(shortticker, 1)
        if (tops.length == 1) {
            let top1 = tops[0]
            let rt = top1.rate / (ts - this.lastTickTime) * 1000
            console.log(top1.rate)
            console.log(`rt: ${rt}`)
            top1.rate = rt
            if (top1.rate > 0.015) {
                top1.sharp = true
                top1.fluctuation = {}
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
                    this.attachStrategyOnWatching((symbol, price, time) => {
                        if (symbol == top1.symbol) {
                            top1.fluctuation![time] = price
                        }
                    })
                    setTimeout(() => {
                        n_hbsocket.send(JSON.stringify(unSubReq))
                        this.removeStrategiesOnWatching()
                        write_top1(top1)
                    }, this.tickTimeGap);
                }
            } else {
                write_top1(top1)
            }
        }
        this.lastTick = dt
        this.lastTickTime = ts
    }

    attachStrategyOnRise(strategy: (symbol: string, price: number, time: number) => void) {
        this.onRise.addListener('buy', strategy)
    }

    attachStrategyOnFall(strategy: (symbol: string, price: number, time: number) => void) {
        this.onFall.addListener('sell', strategy)
    }

    attachStrategyOnWatching(strategy: (symbol: string, price: number, time: number) => void) {
        this.onWatching.addListener('watch', strategy)
    }

    removeStrategiesOnWatching() {
        this.onWatching.removeAllListeners()
    }

    removeAllStrategies() {
        this.onRise.removeAllListeners()
        this.onRise.removeAllListeners()
    }

}

export const observer = MarketObserver.getInstance()