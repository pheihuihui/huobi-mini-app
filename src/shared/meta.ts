import {
    TReq_market_tickers,
    TReq_v1_account_accounts,
    TReq_v1_account_accounts_$account_id$_balance,
    TReq_v1_common_currencys,
    TReq_v1_common_symbols,
    TReq_v1_order_batch_orders,
    TReq_v1_order_orders,
    TReq_v1_order_orders_$order_id$,
    TReq_v1_order_orders_place,
    TReq_v2_account_asset_valuation
} from './meta_request'
import {
    TResp_market_tickers,
    TResp_v1_account_accounts,
    TResp_v1_account_accounts_$account_id$_balance,
    TResp_v1_common_currencys,
    TResp_v1_common_symbols,
    TResp_v1_order_batch_orders,
    TResp_v1_order_orders,
    TResp_v1_order_orders_$order_id$,
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

export type TReqParas<T extends keyof TRequestMap> = {
    path?: string
    json?: TRequestMap[T] extends never ? never : TRequestMap[T]
}

export const requestNames = [
    '/v1/order/orders',
    '/v1/common/symbols',
    '/v1/account/accounts',
    '/v1/order/orders/{order-id}',
    '/v2/account/asset-valuation',
    '/v1/account/accounts/{account-id}/balance',
    '/v1/common/currencys',
    '/market/tickers',
    '/v1/order/orders/place',
    '/v1/order/batch-orders'
] as const

export type TRequestName = (typeof requestNames)[number]

export type TPeriod = '1min' | '5min' | '15min' | '30min' | '60min' | '4hour' | '1day' | '1mon' | '1week' | '1year'

export type TRequestMap = {
    '/v1/order/orders': TReq_v1_order_orders
    '/v1/common/symbols': TReq_v1_common_symbols
    '/v1/account/accounts': TReq_v1_account_accounts
    '/v1/order/orders/{order-id}': TReq_v1_order_orders_$order_id$
    '/v2/account/asset-valuation': TReq_v2_account_asset_valuation
    '/v1/account/accounts/{account-id}/balance': TReq_v1_account_accounts_$account_id$_balance
    '/v1/common/currencys': TReq_v1_common_currencys
    '/v1/order/orders/place': TReq_v1_order_orders_place
    '/market/tickers': TReq_market_tickers
    '/v1/order/batch-orders': TReq_v1_order_batch_orders
} | Record<TRequestName, never>

export type TResponseMap = {
    '/v1/order/orders': TResp_v1_order_orders
    '/v1/common/symbols': TResp_v1_common_symbols
    '/v1/account/accounts': TResp_v1_account_accounts
    '/v2/account/asset-valuation': TResp_v2_account_asset_valuation
    '/v1/account/accounts/{account-id}/balance': TResp_v1_account_accounts_$account_id$_balance
    '/v1/common/currencys': TResp_v1_common_currencys
    '/v1/order/orders/place': TResp_v1_order_orders_place
    '/market/tickers': TResp_market_tickers
    '/v1/order/orders/{order-id}': TResp_v1_order_orders_$order_id$
    '/v1/order/batch-orders': TResp_v1_order_batch_orders
} | Record<TRequestName, never>

export const requestInfoMap: Record<keyof TRequestMap, TReqInfo> = {
    '/v1/order/orders': { needAuth: true, paras: 'json', method: 'GET', version: 'v1' },
    '/v1/common/symbols': { needAuth: false, paras: 'none', method: 'GET', version: 'v1' },
    '/v1/account/accounts': { needAuth: true, paras: 'none', method: 'GET', version: 'v1' },
    '/v1/order/orders/{order-id}': { needAuth: true, paras: 'path', method: 'GET', version: 'v1' },
    '/v2/account/asset-valuation': { needAuth: true, paras: 'json', method: 'GET', version: 'v2' },
    '/v1/account/accounts/{account-id}/balance': { needAuth: true, paras: 'path', method: 'GET', version: 'v1' },
    '/v1/common/currencys': { needAuth: false, paras: 'none', method: 'GET', version: 'v1' },
    '/v1/order/orders/place': { needAuth: true, paras: 'json', method: 'POST', version: 'v1' },
    '/market/tickers': { needAuth: false, paras: 'none', method: 'GET', version: 'none' },
    '/v1/order/batch-orders': { needAuth: true, paras: 'none', method: 'POST', version: 'v1' }
}
