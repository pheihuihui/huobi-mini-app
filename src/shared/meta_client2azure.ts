import { TQuoteCoin } from "./helper"
import { TResp_v1_order_orders_$order_id$ } from "./meta_response"

type TMethod = 'GET' | 'POST'
type TBaseClient2Azure<M extends TMethod, ReqPath, ReqBody, Resp> = {
    requestType: M
    requestPath: ReqPath,
    requestBody: ReqBody,
    response: Resp
}

type TSymbolStair = Partial<Record<TQuoteCoin, string[]>>
type TSymbolsQuery = TBaseClient2Azure<'GET', never, never, TSymbolStair>

type TBuy = TBaseClient2Azure<
    'POST',
    never,
    { coin: string },
    TResp_v1_order_orders_$order_id$
>

type TSell = TBaseClient2Azure<
    'POST',
    never,
    { coin: string },
    TResp_v1_order_orders_$order_id$
>

type TOrderQuery = TBaseClient2Azure<
    'GET',
    { orderID: string },
    never,
    TResp_v1_order_orders_$order_id$
>

type TTestNoParas = TBaseClient2Azure<'GET', never, never, string>

type TServerStatus = TBaseClient2Azure<'GET', never, never, any>

//////////////////////

type TFilter<Base, Condition> = {
    [K in keyof Base]: Base[K] extends Condition ? Base[K] : never
}

type TBaseMap = {
    '/query/symbols/stair': TSymbolsQuery
    '/buy': TBuy
    '/sell': TSell
    '/query/order/:orderID': TOrderQuery
    '/test': TTestNoParas
    '/query/server/status': TServerStatus
}

export type TClientReqAndRespMap = TFilter<TBaseMap, TBaseClient2Azure<TMethod, any, any, any>>
