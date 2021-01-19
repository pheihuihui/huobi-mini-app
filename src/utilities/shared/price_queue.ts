export class PriceQueue {
    private prices: Record<number, [number, boolean]>
    private lastUpdateTime: number
    private maxLength: number
    private rising: boolean
    private falling: boolean
    private growthRate: number
    private reductionRate: number

    constructor(maxLength: number, growth: number, reduction: number) {
        this.prices = {}
        this.lastUpdateTime = 0
        this.maxLength = maxLength
        this.rising = false
        this.growthRate = growth
        this.falling = false
        this.reductionRate = reduction
    }

    getLastUpdateTime() {
        return this.lastUpdateTime
    }

    getCurrentLength() {
        return Object.keys(this.prices).length
    }

    isRising() {
        return this.rising
    }

    isFalling() {
        return this.falling
    }

    push(time: number, price: number) {
        let keys = Object.keys(this.prices).map(x => Number(x)).sort((a, b) => a - b)
        if (keys.length == this.maxLength) {
            delete this.prices[keys[0]]
        }
        this.lastUpdateTime = time
        if (keys.length == 0) {
            this.prices[time] = [price, true]
        } else {
            let lastTime = keys[keys.length - 1]
            let latestPrice = this.prices[lastTime][0]
            let rate = (price - latestPrice) / (time - lastTime)
            if (rate > this.growthRate) {
                this.prices[time] = [price, true]
            } else {
                this.prices[time] = [price, false]
                if (rate < this.reductionRate) {
                    this.falling = true
                } else {
                    this.falling = false
                }
            }
        }
        let vals = Object.values(this.prices).map(x => x[1])
        if (vals.length == this.maxLength && vals.findIndex(v => v == false) == -1) {
            this.rising = true
        } else {
            this.rising = false
        }
    }
}