import { huobi_read_access, huobi_trade_access } from "../client/client_credentials"
import { getCurrentDateTimeString } from "../shared/helper"
import { TApiType } from "../shared/meta"
import { TCommonReqFields } from "../shared/meta_request"

// native browser api
// https://stackoverflow.com/questions/49081874/i-have-to-hash-a-text-with-hmac-sha256-in-javascript
export async function to64_browser(key: string, message: string) {
    const g = (str: string) => new Uint8Array([...unescape(encodeURIComponent(str))].map(c => c.charCodeAt(0))),
        k = g(key),
        m = g(message),
        c = await crypto.subtle.importKey('raw', k, { name: 'HMAC', hash: 'SHA-256' }, true, ['sign']),
        s = await crypto.subtle.sign('HMAC', c, m);
    [...new Uint8Array(s)].map(b => b.toString(16).padStart(2, '0')).join('');
    return btoa(String.fromCharCode(...new Uint8Array(s)))
}

export function getCommonReqFieldsData(type: TApiType): TCommonReqFields {
    return {
        AccessKeyId: type == 'read' ? huobi_read_access : huobi_trade_access,
        SignatureMethod: 'HmacSHA256',
        SignatureVersion: 2,
        Timestamp: getCurrentDateTimeString()
    }
}