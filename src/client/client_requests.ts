import { combineUrl } from "../shared/helper"
import { TClientReqAndRespMap } from "../shared/meta_client2azure"

const headers = new Headers({
    'passwd': localStorage['passwd'] ?? '',
    'Content-Type': 'application/json'
})

const urlPrefix = localStorage['urlPrefix'] ?? ''

const reqParas_GET: RequestInit = {
    method: 'GET',
    mode: 'cors',
    headers: headers
}

const reqParas_POST: (bd: any) => RequestInit = bd => {
    return {
        method: 'POST',
        mode: 'cors',
        headers: headers,
        body: JSON.stringify(bd)
    }
}

type TPathParas<T extends keyof TClientReqAndRespMap> = TClientReqAndRespMap[T]['requestPath']
type TBodyParas<T extends keyof TClientReqAndRespMap> = TClientReqAndRespMap[T]['requestBody']
async function sendRequest<T extends keyof TClientReqAndRespMap>(name: T, paras: { type: TClientReqAndRespMap[T]['requestType'], paths?: TPathParas<T>, body?: TBodyParas<T> }) {
    let promise
    let url: string
    if (paras.paths) {
        url = combineUrl(name, paras.paths)
    } else {
        url = name
    }
    if (paras.type == 'GET') {
        promise = fetch(urlPrefix + name, reqParas_GET)
    }
    if (paras.type == 'POST') {
        if (paras.body) {
            promise = fetch(urlPrefix + name, reqParas_POST(paras.body))
        } else {
            promise = fetch(urlPrefix + name)
        }
    }
    if (promise) {
        let pr = await promise
        let rs = await pr.json()
        return rs as TClientReqAndRespMap[T]['response']
    }
}

function allIn(cur: string) {
    sendRequest('/buy', { type: 'POST', body: { coin: cur } })
        .then(x => console.log(x))
}

function allOut(cur: string) {
    sendRequest('/sell', { type: 'POST', body: { coin: cur } })
        .then(x => console.log(x))
}

function testConnection() {
    sendRequest('/query/account/status', { type: 'GET' })
        .then(x => console.log(x))
}

declare global {
    interface Window {
        allIn: any
        allOut: any
        testConnection: any
    }
}

export function attachFunctions2Window() {
    window.allIn = allIn
    window.allOut = allOut
    window.testConnection = testConnection
}