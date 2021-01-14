import { ISub, IPing, IPong } from "../shared/meta"

export let hbsocket: WebSocket

export function openSocket() {
    hbsocket = new WebSocket('wss://api.huobi.pro/ws')

    let sub: ISub = {
        sub: 'market.btcusdt.kline.5min',
        id: 'myid'
    }
    hbsocket.onopen = () => {
        hbsocket.send(JSON.stringify(sub))
    }

    hbsocket.onmessage = async (event) => {
        let data = event.data as Blob
        let decompressedData = await decompressBlob(data)
        let txt = await decompressedData.text()
        let obj = JSON.parse(txt) as IPing
        console.log(obj)
        if (obj.ping) {
            let pong: IPong = { pong: obj.ping }
            hbsocket.send(JSON.stringify(pong))
        }
    }

    hbsocket.onclose = () => {
        console.log('closed')
    }

}

declare class DecompressionStream {
    constructor(str: string)
}

declare global {
    interface Window {
        DecompressionStream: DecompressionStream
    }
}

function decompressBlob(blob: Blob) {
    if (!window.DecompressionStream) {
        alert('DecompressionStream not supported, please use chromium based browsers.')
    }
    const ds = new DecompressionStream('gzip')
    const decompressedStream = blob.stream().pipeThrough(ds as any)
    return new Response(decompressedStream as any).blob()
}
