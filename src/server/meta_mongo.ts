import { TQuoteCoin } from "../shared/helper"
import { TTrade } from "../shared/meta_request"

export interface IModels {
    currencys: {
        length: number
        added_currencys: Array<string>
        removed_currencys: Array<string>
        all_currencys: Array<string>
    }
    log: {
        trade_type: TTrade
        symbol: string
        amount: number
        price: number
    }
    info: {
        text: string
    }
    top1: {
        symbol: string
        rate: number
        sharp: boolean
        fluctuation?: Record<number, number>
    }
    symbolBoard: Record<string, Partial<Record<TQuoteCoin, {
        minOrderValue: number
        maxOrderValue: number | null
    }>>>
    bigRise: {
        symbol: string
        rate: number
        fluctuation: Record<number, number>
    }
    bigFall: {
        symbol: string
        rate: number
        fluctuation: Record<number, number>
    }
}

export type TModelName = keyof IModels

export type TModel<T extends TModelName> = {
    timestamp: number
    type: T
    content: IModels[T]
}
