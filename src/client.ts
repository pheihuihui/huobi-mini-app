import { backgroundImage_dark } from "./client/view/themes"

let canv = document.createElement('canvas')
canv.style.height = '10000'
canv.style.width = '10000'
document.body.appendChild(canv)
document.body.style.backgroundImage = backgroundImage_dark

let ctx = canv.getContext('2d')
if (ctx) {
    ctx.fillStyle = "rgb(200,0,0)"
    ctx.fillRect(10, 10, 5500, 5000)
    ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
    ctx.fillRect(30, 30, 55, 50);
}

const urlPrefix = 'https://cryptowatcher.azurewebsites.net/'

function testConnection() {
    const url = 'https://cryptowatcher.azurewebsites.net/top1s/count'
    fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: new Headers({
            'passwd': localStorage.getItem('passwd') ?? '',
            'Content-Type': 'application/json'
        })
    })
        .then(x => x.json())
        .then(x => console.log(x))
}

function listAllTop1s() {
    const url = 'https://cryptowatcher.azurewebsites.net/top1s'
    fetch(url, {
        mode: 'cors',
        method: 'GET',
        headers: new Headers({
            'passwd': localStorage.getItem('passwd') ?? '',
            'Content-Type': 'application/json'
        })
    })
        .then(x => x.json())
        .then(x => console.log(x))
}

function listAllSymbols() {
    fetch(urlPrefix + 'board', {
        mode: 'cors',
        method: 'GET',
        headers: new Headers({
            'passwd': localStorage.getItem('passwd') ?? '',
            'Content-Type': 'application/json'
        })
    })
        .then(x => x.json())
        .then(x => console.log(x))
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