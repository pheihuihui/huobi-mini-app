import express from 'express'
import { TClientReqAndRespMap } from '../shared/meta_client2azure'
import { globals } from './global'
import { buy, retrieveAllSymbols_stair, sell } from './jobs'
import { retrieveHuobiResponse } from './request'

type THandlerInfo<T extends keyof TClientReqAndRespMap> = {
    name: T,
    type: TClientReqAndRespMap[T]['requestType'],
    handler: (req: express.Request<{}, {}, TClientReqAndRespMap[T]['requestBody']>, res: express.Response<TClientReqAndRespMap[T]['response']>) => void
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

const query_symbols_stair: THandlerInfo<'/query/symbols/stair'> = {
    name: '/query/symbols/stair',
    type: 'GET',
    handler: async (req, res) => {
        let ret = await retrieveAllSymbols_stair()
        res.json(ret)
    }
}

const query_server_status: THandlerInfo<'/server/status'> = {
    name: '/server/status',
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

export const handlers: THandlerInfo<any>[] = [
    post_buy,
    post_sell,
    query_symbols_stair
]