// native browser api
// https://stackoverflow.com/questions/49081874/i-have-to-hash-a-text-with-hmac-sha256-in-javascript
export async function to64_browser(key: string, secret: string) {
    const g = (str: string) => new Uint8Array([...unescape(encodeURIComponent(str))].map(c => c.charCodeAt(0)))
    const k = g(key)
    const m = g(secret)
    const c = await crypto.subtle.importKey('raw', k, { name: 'HMAC', hash: 'SHA-256' }, true, ['sign'])
    const s = await crypto.subtle.sign('HMAC', c, m)
    // [...new Uint8Array(s)].map(b => b.toString(16).padStart(2, '0')).join('');
    return btoa(String.fromCharCode(...new Uint8Array(s)))
}
