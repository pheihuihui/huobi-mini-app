export const urlPrefix = 'https://api.huobi.pro'
export const baseCoin = 'usdt'
export const apiDomain = 'api.huobi.pro'
export const requestNames = [
    '/v1/order/orders',
    '/v1/common/symbols',
    '/v1/account/accounts',
    '/v1/order/orders/{order-id}',
    '/v2/account/asset-valuation',
    '/v1/account/accounts/{account-id}/balance',
    '/v1/common/currencys',
    '/v1/order/orders/place'
] as const