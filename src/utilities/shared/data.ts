import { matchLast } from "./helper"
import { TResp_market_tickers } from "./meta_response"

export const top10symbols = (data: TResp_market_tickers) => {
    let usdttickers = data.filter(v => matchLast(v.symbol, 'usdt'))
    let topten = usdttickers
        .sort((a, b) => {
            let aa = a.close / a.open - 1
            let bb = b.close / b.open - 1
            return bb - aa
        })
        .filter((v, i) => i < 10)
        .map(x => {
            return {
                symbol: x.symbol,
                rate: x.close / x.open - 1
            }
        })
    return topten
}