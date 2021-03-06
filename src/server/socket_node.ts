import { huobiwss } from "../shared/constants"
import { ISub, IPing, IPong, IUnsub } from "../shared/meta"
import nWebSocket from 'ws'
import { gunzip } from 'zlib'
import { TTick } from "../shared/meta_socket"

export let n_hbsocket: nWebSocket

export function openNodeWebSocket() {
    n_hbsocket = new nWebSocket(huobiwss)

    n_hbsocket.onmessage = async (event) => {
        let dt = event.data as ArrayBuffer
        gunzip(dt, (err, res) => {
            let str = res.toString()
            let obj = JSON.parse(str)
            if (obj.ping) {
                let pong: IPong = { pong: obj.ping }
                n_hbsocket.send(JSON.stringify(pong))
            }
            if (obj.tick) {
                let ts = obj.ts as number
                let ch = obj.ch as string
                let symbol = ch.split('.')[1]
            }
        })
    }
}