import { TTrade } from "../shared/meta_request"

export type TCurrencys = {
    length: number
    added_currencys: Array<string>
    removed_currencys: Array<string>
    all_currencys: Array<string>
}

export type TTradingLog = {
    trade_type: TTrade
    symbol: string
    amount: number
    price: number
}

export type TInfo = {
    text: string
}

export type TIncrease = {
    symbol: string
    rate: number
    sharp: boolean
    fluctuation?: Record<number, number>
}

export type TTops = Array<TIncrease>

export const baseCoins = ['usdt', 'husd', 'btc', 'eth', 'ht'] as const
export type TBaseCoin = (typeof baseCoins)[number]
export type TSymbolBoard = Record<string, Partial<Record<TBaseCoin, {
    minOrderValue: number
    maxOrderValue: number
}>>>

export interface IModels {
    currencys: TCurrencys
    log: TTradingLog
    info: TInfo
    tops: TTops
    top1: TIncrease
    symbolBoard: TSymbolBoard
}

export type TModelName = keyof IModels

export type TModel<T extends TModelName> = {
    timestamp: number
    type: T
    content: IModels[T]
}
