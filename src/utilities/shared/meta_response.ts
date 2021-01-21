export type TRespV1<T> = {
    status: string
    data: T
}

export type TPromiseRespV1<T> = Promise<TRespV1<T>>

export type TRespV2<T> = {
    code: number
    ok: boolean
    data: T
}

export type TPromiseRespV2<T> = Promise<TRespV2<T>>

export type TResp_v1_order_orders = any //todo

export type TResp_v1_common_symbols = {
    'base-currency': string
    'quote-currency': string
    'api-trading': boolean
    symbol: string
}

export type TResp_v1_account_accounts = {
    id: number
    state: string
    type: string
    subtype: string
}

export type TResp_v2_account_asset_valuation = {
    balance: number
    timestamp: number
}

export type TResp_v1_account_accounts_$account_id$_balance = {
    id: number
    state: string //
    type: string //
    list: Array<{
        currency: string
        type: string
        balance: number
    }>
}

export type TResp_v1_common_currencys = Array<string>

export type TResp_v2_common_currencys = Array<string>

export type TResp_v1_order_orders_place = string

export type TResp_market_tickers = Array<{
    open: number
    close: number
    low: number
    high: number
    amount: number
    count: number
    vol: number
    symbol: string
    bid: number
    bidSize: number
    ask: number
    askSize: number
}>