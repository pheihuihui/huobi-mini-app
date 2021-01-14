import { Socket } from "socket.io"
import * as http from 'http'
import { ISub, IPing, IPong } from "../shared/meta"

let server = http.createServer()
server.listen(3030)