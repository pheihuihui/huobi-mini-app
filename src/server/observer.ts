import { EventEmitter } from "events";
import { TTick } from "../shared/meta_socket";
import { PriceQueue } from "../shared/price_queue";

export class MarketObserver {
    private static observer: MarketObserver

    private onRise: EventEmitter
    private onFall: EventEmitter

    private prices: Record<string, PriceQueue>

    private timeGap: number
    private growthRate: number
    private reductionRate: number

    private constructor() {
        this.onRise = new EventEmitter()
        this.onFall = new EventEmitter()
        this.prices = {}
        this.timeGap = 10 * 1000
        this.growthRate = 0.005 / 1000
        this.reductionRate = 0
    }

    static getInstance() {
        if (!MarketObserver.observer) {
            MarketObserver.observer = new MarketObserver()
        }
        return MarketObserver.observer
    }

    update(time: number, symbol: string, tick: TTick) {
        for (const key in this.prices) {
            if (Object.prototype.hasOwnProperty.call(this.prices, key)) {
                const element = this.prices[key]
                let last = element.getLastUpdateTime()
                if (time - last > this.timeGap && symbol != key) {
                    delete this.prices[key]
                }
            }
        }
        if (this.prices[symbol]) {
            this.prices[symbol].push(time, tick.close)
        } else {
            let queue = new PriceQueue(5, this.growthRate, this.reductionRate)
            queue.push(time, tick.close)
            this.prices[symbol] = queue
        }
        for (const key in this.prices) {
            if (Object.prototype.hasOwnProperty.call(this.prices, key)) {
                const element = this.prices[key]
                if (element.getState() == 'rising') {
                    this.onRise.emit('buy', key, tick.close, time)
                }
                if (element.getState() == 'falling') {
                    this.onFall.emit('sell', key, tick.close, time)
                }
            }
        }

        // let logs: Record<string, number> = {}
        // for (const key in this.prices) {
        //     if (Object.prototype.hasOwnProperty.call(this.prices, key)) {
        //         const element = this.prices[key];
        //         logs[key] = element.getCurrentLength()
        //     }
        // }
    }

    attachStrategyOnRise(strategy: (symbol: string, price: number, time: number) => void) {
        this.onRise.addListener('buy', strategy)
    }

    attachStrategyOnFall(strategy: (symbol: string, price: number, time: number) => void) {
        this.onFall.addListener('sell', strategy)
    }

    removeAllStrategies() {
        this.onRise.removeAllListeners()
        this.onRise.removeAllListeners()
    }

}