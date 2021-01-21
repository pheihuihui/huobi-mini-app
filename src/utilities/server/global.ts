import nWebSocket from 'ws'
import { read_allCurrencys } from './mongo_client'

export type TGlobalStatus = {
    socket: nWebSocket | null
    top10: Array<string>
    state: 'locked' | 'free'
    holdings: Record<string, number>
    currencysCount: number
    currencys: Array<string>
}

export const globalStatus: TGlobalStatus = {
    socket: null,
    top10: [],
    state: 'free',
    holdings: {},
    currencysCount: 0,
    currencys: []
}

export async function initGlobalStatus() {
    read_allCurrencys()
}