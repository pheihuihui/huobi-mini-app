export class PriceQueue {
    private prices: Record<number, [number, boolean]>
    private lastUpdateTime: number
    private maxLength: number
    private growthRate: number
    private reductionRate: number
    private state: 'rising' | 'falling' | 'floatingup' | 'floatingdown'
    private top: number

    constructor(maxLength: number, growth: number, reduction: number) {
        this.prices = {}
        this.lastUpdateTime = 0
        this.maxLength = maxLength
        this.growthRate = growth
        this.reductionRate = reduction
        this.state = 'floatingdown'
        this.top = -1
    }

    getLastUpdateTime() {
        return this.lastUpdateTime
    }

    getCurrentLength() {
        return Object.keys(this.prices).length
    }

    getState() {
        return this.state
    }

    push(time: number, price: number) {
        let keys = Object.keys(this.prices).map(x => Number(x)).sort((a, b) => a - b)
        if (keys.length == this.maxLength) {
            delete this.prices[keys[0]]
        }
        this.lastUpdateTime = time

        if (this.state == 'falling') {

        }



    }
}