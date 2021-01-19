export type TTick = {
    id: number
    amount: number
    count: number
    open: number
    close: number
    low: number
    high: number
    vol: number
}

export type TKlineUpdate<T> = {
    ch: string
    ts: number
    tick: T
}