import { apiKeys } from "./keys"
import { TApiType } from "./meta"
import { TCommonReqFields } from "./meta_request"

export const parenthesesFilled = (before: string, content: string) => {
    let res = before
    let arr = content.split('/')
    let exp = /\{([^}]*)\}/
    for (const u of arr) {
        let tmp = res.replace(exp, u)
        res = tmp
    }
    return res
}

export function getCurrentDateTimeString() {
    let dt = new Date()
    let tmp = dt.toISOString().split('.')[0]
    return encodeURIComponent(tmp)
}

export const matchLast = (str1: string, str2: string) => {
    let len1 = str1.length
    let len2 = str2.length
    if (len1 <= len2) return false
    for (let u = 0; u < len2; u++) {
        let ch1 = str1[len1 - 1 - u]
        let ch2 = str2[len2 - 1 - u]
        if (ch1 != ch2) return false
    }
    return true
}

export function getCommonReqFieldsData(type: TApiType): TCommonReqFields {
    return {
        AccessKeyId: type == 'read' ? apiKeys.forRead.accessKey : apiKeys.forTrade.accessKey,
        SignatureMethod: 'HmacSHA256',
        SignatureVersion: 2,
        Timestamp: getCurrentDateTimeString()
    }
}