import express from 'express'

type TMiddleWare = (req: express.Request, res: express.Response, next: express.NextFunction) => void
const passwd = process.env.PASSWD || 'passwd'

export const m_authentication: TMiddleWare = function (req, res, next) {
    if (req.headers['passwd'] == passwd) {
        next()
    } else {
        res.status(401)
        res.send('unauthorized')
    }
}

export const m_log: TMiddleWare = function (req, res, next) {
    console.log('log')
    next()
}

// export const m_cors: TMiddleWare = function (req, res, next) {
    
// }