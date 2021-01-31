import { time } from "console";
import { sleep } from "../shared/helper";
import { globals } from "./global";
import { write_trading_log } from "./mongo_client";
// import { write_trading_log } from "./mongo_client";
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

export async function retrieveHoldings() {
    let resp = await retrieveHuobiResponse('/v1/account/accounts/{account-id}/balance', { path: globals.accountID })
    if (resp.status == 'ok') {
        for (const u of resp.data.list) {
            if (u.type == 'trade') {
                globals.holdings[u.currency] = Number(u.balance)
            }
        }
    }
}

export async function retrieveHuobiTradingDetails(orderID: string) {
    let resp = await retrieveHuobiResponse('/v1/order/orders/{order-id}', { path: orderID })
    console.log(resp.status)
    console.log(resp.data)
}