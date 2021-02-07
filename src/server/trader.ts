import { fixed8, sleep } from "../shared/helper";
import { TReq_v1_order_batch_orders } from "../shared/meta_request";
import { globals } from "./global";
import { write_trading_log } from "./mongo_client";
import { retrieveHuobiResponse } from "./request";

export async function allIn(coin: string, baseCoin = 'usdt') {
    let symbol = coin + baseCoin
    let orderID = ''
    let amount = Math.floor(globals.holdings['usdt'])
    let resp = await retrieveHuobiResponse('/v1/order/orders/place', {
        json: {
            "account-id": globals.accountID,
            symbol: symbol,
            type: 'buy-market',
            amount: Number(amount).toString()
        }
    })
    if (resp.status == 'ok') {
        orderID = resp.data
    }
    await write_trading_log(resp.data, 'buy-market')
}

export async function allOut() {
    let orders: TReq_v1_order_batch_orders = []
    let holdings = await retrieveHoldings()
    for (const key in holdings) {
        if (Object.prototype.hasOwnProperty.call(holdings, key)) {
            const element = holdings[key];
            let amount = fixed8(element)
            if (amount > 0) {
                orders.push({
                    'account-id': globals.accountID,
                    symbol: key + 'usdt',
                    type: 'sell-market',
                    amount: amount.toString()
                })
            }
        }
    }
    console.log(orders)
    console.log(orders.length)
    while (orders.length != 0) {
        let tmp = orders.splice(10)
        retrieveHuobiResponse('/v1/order/batch-orders', { json: orders })
            .then(x => console.log(x))
        orders = tmp
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

export async function retrieveHuobiTradingDetails(orderID: string) {
    let resp = await retrieveHuobiResponse('/v1/order/orders/{order-id}', { path: orderID })
    console.log(resp.status)
    console.log(resp.data)
}

export async function sellOne(symbol: string, amount: number) {
    await retrieveHuobiResponse('/v1/order/orders/place', {
        json: {
            "account-id": globals.accountID,
            symbol: symbol,
            type: 'sell-market',
            amount: amount.toString()
        }
    })
}