import express from 'express'
import { countTop1s, getBoard, getTopIncreases } from './mongo_client'

type THandler = (req: express.Request, res: express.Response) => void

export const query_topIncreases: THandler = async function (req, res) {
    let ret = await getTopIncreases()
    res.json({ result: ret })
}

export const query_topIncreaseCount: THandler = async function (req, res) {
    let num = await countTop1s()
    res.json({ result: num })
}

export const query_board: THandler = async function (req, res) {
    let board = await getBoard()
    res.json(board)
}