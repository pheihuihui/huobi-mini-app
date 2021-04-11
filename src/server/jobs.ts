import { added, quoteCoins, removed, tickersSinceLastTime, TQuoteCoin, TSymbolsStair } from "../shared/helper";
import { globals } from "./global";
import { IModels } from "./meta_mongo";
import { insertNewItem } from "./mongo_client";
import { retrieveHuobiResponse } from "./request";
import { n_hbsocket, openNodeWebSocket } from "./socket_node";

export async function testDelay() {
    let start = Date.now()
    let serverTs = 0
    let end = 0
    await retrieveHuobiResponse('/v1/common/currencys', {})
    end = Date.now()
    return {
        server_start: start,
        server_end: end
    }
}

export async function sell(coin: string, paras?: { amount?: number, quoteCoin?: string }) {
    let symbol = coin + 'usdt'
    if (paras && paras.quoteCoin) {
        symbol = coin + paras.quoteCoin
    }
    let amount = 0
    if (paras && paras.amount) {
        amount = amount
    } else {
        let resp = await retrieveHuobiResponse('/v1/account/accounts/{account-id}/balance', {
            path: globals.accountID,
        })
        let lst = resp.data.list.filter(x => x.currency == coin && x.type == 'trade')
        if (lst.length == 1) {
            amount = Math.floor(lst[0].balance * 100000000) / 100000000
        }
    }
    let res = await retrieveHuobiResponse('/v1/order/orders/place', {
        json: {
            "account-id": globals.accountID,
            symbol: symbol,
            type: 'sell-market',
            amount: amount.toString()
        }
    })
    return res.data
}

export async function buy(coin: string, paras?: { amount?: number, quoteCoin?: string }) {
    let symbol = coin + 'usdt'
    if (paras && paras.quoteCoin) {
        symbol = coin + paras.quoteCoin
    }
    let amount = 0
    if (paras && paras.amount) {
        amount = amount
    } else {
        let resp = await retrieveHuobiResponse('/v1/account/accounts/{account-id}/balance', {
            path: globals.accountID,
        })
        let lst = resp.data.list.filter(x => x.currency == 'usdt' && x.type == 'trade')
        if (lst.length == 1) {
            amount = Math.floor(lst[0].balance * 100000000) / 100000000
        }
    }
    let res = await retrieveHuobiResponse('/v1/order/orders/place', {
        json: {
            "account-id": globals.accountID,
            symbol: symbol,
            type: 'buy-market',
            amount: amount.toString()
        }
    })
    return res.data
}

export async function transfer2usdt() {
    await buy('usdt', { quoteCoin: 'btc' })
}

export async function transfer2btc() {
    await buy('btc', { quoteCoin: 'usdt' })
}

export async function retrieveAllSymbols() {
    return retrieveHuobiResponse('/v1/common/symbols', {})
        .then(x => {
            let sbs = x.data
            let res: IModels['symbolBoard'] = {}
            sbs.forEach(v => {
                let quote = v['quote-currency'] as TQuoteCoin
                let base = v['base-currency']
                if (!res[base]) {
                    res[base] = {}
                }
                res[base][quote] = {
                    maxOrderValue: v['max-order-value'] ?? null,
                    minOrderValue: v['min-order-value']
                }
            })
            return res
        })
}

export async function retrieveAllSymbols_stair() {
    return retrieveAllSymbols()
        .then(x => {
            let res: TSymbolsStair = {}
            for (const curr in x) {
                if (Object.prototype.hasOwnProperty.call(x, curr)) {
                    const element = x[curr];
                    for (const u of quoteCoins) {
                        let tmp = element[u]
                        if (tmp) {
                            if (res[u] == undefined) {
                                res[u] = [curr]
                            } else {
                                res[u]?.push(curr)
                            }
                            break
                        }
                    }
                }
            }
            return res
        })
}

export async function retriveNewCurrencys() {
    return retrieveHuobiResponse('/v1/common/currencys', {})
        .then(x => {
            let curs = x.data
            let addedCurs: string[] = []
            let removedCurs: string[] = []
            addedCurs = added(globals.currencys, curs)
            removedCurs = removed(globals.currencys, curs)
            if (addedCurs.length > 0) {
                globals.currencys = curs
                return {
                    AddedCurrencys: addedCurs,
                    removedCurrencys: removedCurs
                }
            }
        })
}

export async function reconnectSocket() {
    if (n_hbsocket && (n_hbsocket.readyState == n_hbsocket.CONNECTING || n_hbsocket.readyState == n_hbsocket.OPEN)) {
        return
    } else {
        openNodeWebSocket()
    }
}

export async function retrieveHoldings() {
    let res: Record<string, number> = {}
    let resp = await retrieveHuobiResponse('/v1/account/accounts/{account-id}/balance', { path: globals.accountID })
    if (resp.status == 'ok') {
        for (const u of resp.data.list) {
            if (u.type == 'trade') {
                res[u.currency] = Number(u.balance)
            }
        }
    }
    return res
}

export async function buyNewCoin(coin: string) {
    let text = new Date().toUTCString()
    text += `\n${coin}`
    let resp1 = await buy(coin)
    let resp2 = await retrieveHuobiResponse('/v1/order/orders/{order-id}', { path: resp1 })
    text += '\n'
    if (resp2.status == 'ok') {
        text += JSON.stringify(resp2.data)
        insertNewItem('info', { text: text })
    }
    if (resp2.status == 'error') {
        await transfer2btc()
        let resp3 = await buy(coin, { quoteCoin: 'btc' })
        let resp4 = await retrieveHuobiResponse('/v1/order/orders/{order-id}', { path: resp3 })
        text += JSON.stringify(resp4.data)
        insertNewItem('info', { text: text })
    }
}

async function _sortAllTickers() {
    let resp1 = await retrieveHuobiResponse('/market/tickers', {})
    let lastTickers = globals.lastTickers
    let curTickers = resp1.data
    let sorted = tickersSinceLastTime(lastTickers, curTickers, globals.allSymbols)
    globals.lastTickers = curTickers
    return sorted
}

export async function sortAllTickers() {
    return _sortAllTickers()
        .then(x => {
            for (const u of quoteCoins) {
                let sbs = x[u]
                if (sbs) {
                    sbs = sbs.filter(x => {
                        let op = x.open
                        let cl = x.close
                        let incr = (cl - op) / op
                        return op > 0 && cl > 0 && incr > 0.03
                    })
                }
            }
            return x
        })
}