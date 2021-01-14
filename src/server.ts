import * as http from 'http'

// Create an instance of the http server to handle HTTP requests
let app = http.createServer((req, res) => {
    // Set a response type of plain text for the response
    res.writeHead(200, { 'Content-Type': 'text/plain' })

    // Send back a response and end the connection
    console.log(process.env)
    res.end('Hello World!\n')
});

// Start the server on port 3000
const port = process.env.PORT || 3000
app.listen(port)

