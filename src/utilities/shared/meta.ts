import { requestNames } from "./constants"
import {
    TReq_market_tickers,
    TReq_v1_account_accounts,
    TReq_v1_account_accounts_$account_id$_balance,
    TReq_v1_common_currencys,
    TReq_v1_common_symbols,
    TReq_v1_order_orders,
    TReq_v1_order_orders_$order_id$,
    TReq_v1_order_orders_place,
    TReq_v2_account_asset_valuation,
    TReq_v2_common_currencys
} from './meta_request'
import {
    TResp_v1_account_accounts,
    TResp_v1_account_accounts_$account_id$_balance,
    TResp_v1_common_currencys,
    TResp_v1_common_symbols,
    TResp_v1_order_orders,
    TResp_v1_order_orders_place,
    TResp_v2_account_asset_valuation
} from './meta_response'

export interface IPing {
    ping: number
}

export interface IPong {
    pong: number
}

export interface ISub {
    sub: string
    id: string
}

export interface IUnsub {
    unsub: string
    id: string
}

export type TApiType = 'read' | 'trade'
export type TReqMethod = 'GET' | 'POST'
export type TReqInfo = {
    needAuth: boolean
    paras: 'none' | 'path' | 'json' | 'both'
    method: TReqMethod
    version: 'v1' | 'v2' | 'none'
}
export type TReqParas<T extends keyof IRequestNameMap> = {
    path?: string
    json?: IRequestNameMap[T] extends never ? never : IRequestNameMap[T]
}

export type TRequestName = (typeof requestNames)[number]

export type TReqRespPair<T, U> = {
    request: T
    response: U
}

export type TPeriod = '1min' | '5min' | '15min' | '30min' | '60min' | '4hour' | '1day' | '1mon' | '1week' | '1year'

export interface IRequestNameMap {
    '/v1/order/orders': TReq_v1_order_orders
    '/v1/common/symbols': TReq_v1_common_symbols
    '/v1/account/accounts': TReq_v1_account_accounts
    '/v1/order/orders/{order-id}': TReq_v1_order_orders_$order_id$
    '/v2/account/asset-valuation': TReq_v2_account_asset_valuation
    '/v1/account/accounts/{account-id}/balance': TReq_v1_account_accounts_$account_id$_balance
    '/v1/common/currencys': TReq_v1_common_currencys
    '/v1/order/orders/place': TReq_v1_order_orders_place
    '/market/tickers': TReq_market_tickers
    '/v2/common/currencys': TReq_v2_common_currencys
}

export interface IRequestAndResponseMap {
    '/v1/order/orders': TReqRespPair<TReq_v1_order_orders, TResp_v1_order_orders>
    '/v1/common/symbols': TReqRespPair<TReq_v1_common_symbols, TResp_v1_common_symbols>
    '/v1/account/accounts': TReqRespPair<TReq_v1_account_accounts, TResp_v1_account_accounts>
    '/v1/order/orders/{order-id}': TReqRespPair<TReq_v1_order_orders_$order_id$, any>
    '/v2/account/asset-valuation': TReqRespPair<TReq_v2_account_asset_valuation, TResp_v2_account_asset_valuation>
    '/v1/account/accounts/{account-id}/balance': TReqRespPair<TReq_v1_account_accounts_$account_id$_balance, TResp_v1_account_accounts_$account_id$_balance>
    '/v1/common/currencys': TReqRespPair<TReq_v1_common_currencys, TResp_v1_common_currencys>
    '/v1/order/orders/place': TReqRespPair<TReq_v1_order_orders_place, TResp_v1_order_orders_place>
}

export const requestInfoMap: Record<keyof IRequestNameMap, TReqInfo> = {
    '/v1/order/orders': { needAuth: true, paras: 'json', method: 'GET', version: 'v1' },
    '/v1/common/symbols': { needAuth: false, paras: 'none', method: 'GET', version: 'v1' },
    '/v1/account/accounts': { needAuth: true, paras: 'none', method: 'GET', version: 'v1' },
    '/v1/order/orders/{order-id}': { needAuth: true, paras: 'path', method: 'GET', version: 'v1' },
    '/v2/account/asset-valuation': { needAuth: true, paras: 'json', method: 'GET', version: 'v2' },
    '/v1/account/accounts/{account-id}/balance': { needAuth: true, paras: 'path', method: 'GET', version: 'v1' },
    '/v1/common/currencys': { needAuth: false, paras: 'none', method: 'GET', version: 'v1' },
    '/v1/order/orders/place': { needAuth: true, paras: 'json', method: 'POST', version: 'v1' },
    '/market/tickers': { needAuth: false, paras: 'none', method: 'GET', version: 'none' },
    '/v2/common/currencys': { needAuth: false, paras: 'none', method: 'GET', version: 'v2' }
}
