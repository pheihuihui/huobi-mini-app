import ReactDOM from "react-dom"
import { getSymbolBoard } from "./client/view/SymbolBoard"
import { backgroundImage_dark } from "./client/view/themes"

let canv = document.createElement('canvas')
canv.style.height = '10000'
canv.style.width = '10000'
document.body.appendChild(canv)
// document.body.style.backgroundImage = backgroundImage_dark
document.body.style.backgroundColor = 'grey'


let panel = document.createElement('div')
document.body.appendChild(panel)

let ctx = canv.getContext('2d')
if (ctx) {
    ctx.fillStyle = "rgb(200,0,0)"
    ctx.fillRect(10, 10, 5500, 5000)
    ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
    ctx.fillRect(30, 30, 55, 50);
}

const urlPrefix = 'https://cryptowatcher.azurewebsites.net'
const headers = new Headers({
    'passwd': localStorage.getItem('passwd') ?? '',
    'Content-Type': 'application/json'
})
const reqParas: RequestInit = {
    method: 'GET',
    mode: 'cors',
    headers: headers
}

function testConnection() {
    fetch(urlPrefix + '/top1s/count', reqParas)
        .then(x => x.json())
        .then(x => console.log(x))
}

function listAllTop1s() {
    fetch(urlPrefix + '/top1s', reqParas)
        .then(x => x.json())
        .then(x => console.log(x))
}

function listAllSymbols() {
    fetch(urlPrefix + '/board', reqParas)
        .then(x => x.json())
        .then(x => {
            let bd = getSymbolBoard(x.content)
            ReactDOM.render(bd, panel)
        })
}

function testDelayFromClient() {
    let start = Date.now()
    fetch(urlPrefix + '/test/delay', reqParas)
        .then(x => x.json())
        .then(x => {
            console.log(start)
            console.log(x['server_start'])
            console.log(x['server_end'])
            console.log(Date.now())
        })
}

declare global {
    interface Window {
        testConnection: any
        listAllTop1s: any
        listAllSymbols: any
    }
}

window.testConnection = testConnection
window.listAllTop1s = listAllTop1s
window.listAllSymbols = listAllSymbols

listAllSymbols()