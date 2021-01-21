export type TReqBase = Record<string, boolean | number | string>

export type TCommonReqFields = {
    AccessKeyId: string
    SignatureMethod: 'HmacSHA256'
    SignatureVersion: 2
    Timestamp: string
}

export type TReq_v1_order_orders = {
    symbol: string
    types?: string //todo
    'start-time'?: number
    'end-time'?: number
    'start-date'?: string
    'end-date'?: string
    states: 'submitted' | 'partial-filled' | 'partial-canceled' | 'filled' | 'canceled' | 'created' // todo
    from?: string
    direct?: 'prev' | 'next'
    size?: string
}

export type TReq_v1_common_symbols = never

export type TReq_v1_account_accounts = never

export type TReq_v1_order_orders_$order_id$ = never

export type TReq_v2_account_asset_valuation = {
    accountType: 'spot' | 'margin' | 'otc' | 'super-margin'
    valuationCurrency?: 'BTC' | 'CNY' | 'USD'
    subUid?: string
}

export type TReq_v1_account_accounts_$account_id$_balance = never

export type TReq_v1_common_currencys = never

export type TReq_v2_common_currencys = never

export type TReq_v1_order_orders_place = {
    'account-id': string
    symbol: string
    type: 'buy-market' | 'sell-market' | 'buy-limit' | 'sell-limit' | 'buy-ioc' | 'sell-ioc' | 'buy-limit-maker' | 'sell-limit-maker' | 'buy-stop-limit' | 'sell-stop-limit' | 'buy-limit-fok' | 'sell-limit-fok' | 'buy-stop-limit-fok' | 'sell-stop-limit-fok'
    amount: string
    price?: string
    source?: 'spot-api' | 'margin-api' | 'super-margin-api' | 'c2c-margin-api'
    'client-order-id'?: string
    'stop-price'?: string
    operator?: 'gte' | 'lte'
}

export type TReq_market_tickers = never