import express from 'express'
import { TClientReqAndRespMap, TFall, TRise } from '../shared/meta_client2azure'
import { globals } from './global'
import { buy, retrieveAllSymbols_stair, sell } from './jobs'
import { countItems, readItems } from './mongo_client'
import { retrieveHuobiResponse } from './request'

type THandlerInfo<T extends keyof TClientReqAndRespMap> = {
    name: T,
    type: TClientReqAndRespMap[T]['requestType'],
    handler: (req: express.Request<TClientReqAndRespMap[T]['requestPath'], {}, TClientReqAndRespMap[T]['requestBody']>, res: express.Response<TClientReqAndRespMap[T]['response']>) => void
}

const post_buy: THandlerInfo<'/buy'> = {
    name: '/buy',
    type: 'POST',
    handler: async (req, res) => {
        let coin = req.body.coin
        let ret1 = await buy(coin)
        let ret2 = await retrieveHuobiResponse('/v1/order/orders/{order-id}', { path: ret1 })
        res.json(ret2.data)
    }
}

const post_sell: THandlerInfo<'/sell'> = {
    name: '/sell',
    type: 'POST',
    handler: async (req, res) => {
        let coin = req.body.coin
        let ret1 = await sell(coin)
        let ret2 = await retrieveHuobiResponse('/v1/order/orders/{order-id}', { path: ret1 })
        res.json(ret2.data)
    }
}

const post_test_buy_new_coin: THandlerInfo<'/test/buy/new/coin'> = {
    name: '/test/buy/new/coin',
    type: 'POST',
    handler: async (req, res) => {
        globals.currencys = req.body.setCurrencys
        res.json(globals.currencys)
    }
}

const query_symbols_stair: THandlerInfo<'/query/symbols/stair'> = {
    name: '/query/symbols/stair',
    type: 'GET',
    handler: async (req, res) => {
        let ret = await retrieveAllSymbols_stair()
        res.json(ret)
    }
}

const query_server_status: THandlerInfo<'/query/server/status'> = {
    name: '/query/server/status',
    type: 'GET',
    handler: async (req, res) => {
        let ret = {
            lastTickers: globals.lastTickers,
            holdings: globals.holdings,
            currencies: globals.currencys,
            symbols: globals.allSymbols
        }
        res.json(ret)
    }
}

const query_account_status: THandlerInfo<'/query/account/status'> = {
    name: '/query/account/status',
    type: 'GET',
    handler: async (req, res) => {
        let ret = {
            id: globals.accountID,
            status: globals.state
        }
        res.json(ret)
    }
}

const query_rises: THandlerInfo<'/query/rises'> = {
    name: '/query/rises',
    type: 'GET',
    handler: async (req, res) => {
        let tmp = await readItems('bigRise')
        let ret = tmp.map(x => <TRise>{ timestamp: x.timestamp, symbol: x.content.symbol, rate: x.content.rate })
        res.json(ret)
    }
}

const query_falls: THandlerInfo<'/query/falls'> = {
    name: '/query/falls',
    type: 'GET',
    handler: async (req, res) => {
        let tmp = await readItems('bigFall')
        let ret = tmp.map(x => <TFall>{ timestamp: x.timestamp, symbol: x.content.symbol, rate: x.content.rate })
        res.json(ret)
    }
}

const query_count: THandlerInfo<'/query/count/:itemType'> = {
    name: '/query/count/:itemType',
    type: 'GET',
    handler: async (req, res) => {
        let para = req.params.itemType
        let ret = await countItems(para)
        res.json(ret)
    }
}

export const handlers: THandlerInfo<any>[] = [
    post_buy,
    post_sell,
    query_symbols_stair,
    query_server_status,
    query_account_status,
    query_falls,
    query_rises,
    query_count
]