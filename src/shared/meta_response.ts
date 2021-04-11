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

export type TResp_v1_common_symbols = Array<{
    'base-currency': string
    'quote-currency': string
    'api-trading': boolean
    "price-precision": number
    "amount-precision": number
    symbol: string
    state: 'online' | 'offline' | 'suspend' | 'pre-online',
    'min-order-value': number
    'max-order-value'?: number
}>

export type TResp_v1_account_accounts = Array<{
    id: number
    state: 'working' | 'lock'
    type: 'otc' | 'spot'
    subtype: string
}>

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
        type: 'trade' | 'frozen' | 'loan' | 'interest' | 'lock' | 'bank'
        balance: number
    }>
}

export type TResp_v1_common_currencys = Array<string>

export type TResp_v2_common_currencys = Array<string>

export type TResp_v1_order_orders_place = string

export type TResp_v1_order_batch_orders = Array<{
    'order-id': number
    'client-order-id': string
    'err-code'?: string
    'err-msg'?: string
}>

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

export type TResp_v1_order_orders_$order_id$ = {
    'account-id': number
    amount: string
    'canceled-at'?: number
    'created-at': number
    'field-amount': string
    'field-cash-amount': string
    'field-fees': string
    'finished-at'?: number
    id: number
    'client-order-id'?: string
    price: string
    state: string
    symbol: string
    type: string
    'stop-price'?: string
    operator?: string
}