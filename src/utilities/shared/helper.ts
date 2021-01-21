import { TApiType, TPeriod } from "./meta"
import { TResp_market_tickers } from "./meta_response"

export const parenthesesFilled = (before: string, content: string) => {
    let res = before
    let arr = content.split('/')
    let exp = /\{([^}]*)\}/
    for (const u of arr) {
        let tmp = res.replace(exp, u)
        res = tmp
    }
    return res
}

export function getCurrentDateTimeString() {
    let dt = new Date()
    let tmp = dt.toISOString().split('.')[0]
    return encodeURIComponent(tmp)
}

export const matchLast = (str1: string, str2: string) => {
    let len1 = str1.length
    let len2 = str2.length
    if (len1 <= len2) return false
    for (let u = 0; u < len2; u++) {
        let ch1 = str1[len1 - 1 - u]
        let ch2 = str2[len2 - 1 - u]
        if (ch1 != ch2) return false
    }
    return true
}

export const topSymbols = (data: TResp_market_tickers, num: number, base?: string) => {
    let baseCoin = base ?? 'usdt'
    let usdttickers = data.filter(v => matchLast(v.symbol, baseCoin))
    let topten = usdttickers
        .sort((a, b) => {
            let aa = a.close / a.open - 1
            let bb = b.close / b.open - 1
            return bb - aa
        })
        .filter((v, i) => i < num)
        .map(x => {
            return {
                symbol: x.symbol,
                rate: x.close / x.open - 1
            }
        })
    return topten
}

export const toSubscriptionStr = (symbol: string, period: TPeriod) => `market.${symbol}.kline.${period}`

export const added = <T>(oldArr: Array<T>, newArr: Array<T>) => {
    let res: Array<T> = []
    for (const u of newArr) {
        if (oldArr.findIndex(x => x == u) == -1) res.push(u)
    }
    return res
}

export const removed = <T>(oldArr: Array<T>, newArr: Array<T>) => {
    let res: Array<T> = []
    for (const u of oldArr) {
        if (newArr.findIndex(x => x == u) == -1) res.push(u)
    }
    return res
}