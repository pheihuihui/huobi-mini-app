import React, { FunctionComponent } from "react";
import { TSymbolBoard } from "../../server/meta_mongo";

const SymbolBoard: FunctionComponent<{ board: TSymbolBoard }> = (props) => {
    const quoteCoins = ["usdt", "husd", "btc", "eth", "ht"] as const
    const allCoins = Object.keys(props.board)
    return (
        <table>
            <thead>
                <tr>
                    <td>{'as'}</td>
                    {
                        quoteCoins.map(x => <td>{x}</td>)
                    }
                </tr>
            </thead>
            <tbody>
                {
                    allCoins.map(x => <tr>
                        <td>{x}</td>
                        {quoteCoins.map(v => {
                            let val = props.board[x][v]
                            if (val) {
                                if (val.maxOrderValue) {
                                    return <td>{`[${val.minOrderValue}, ${val.maxOrderValue}]`}</td>
                                } else {
                                    return <td>{`[${val.minOrderValue}, ...\t ]`}</td>
                                }
                            } else {
                                return <td>{`none`}</td>
                            }
                        })}
                    </tr>)
                }
            </tbody>
        </table>
    )
}

export const getSymbolBoard = (board: TSymbolBoard) => <SymbolBoard board={board} />