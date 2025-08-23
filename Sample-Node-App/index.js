const express = require('express')
const {v4:uuid} = require('uuid')
const fs = require('fs')

const app = express();

const levels = ["info", "debug", "error", "warn", "critical"]

app.get('/daksh', (req,res) => {
    res.send("Hello Daksh");
    
    const requestId = uuid()

    //stdout
    // console.log(`[${new Date().toISOString()}] INFO: GET /daksh endpoint called`);
    // console.log(`[${new Date().toISOString()}] DEBUG: Request headers:`, req.headers);
    // console.log(`[${new Date().toISOString()}] DEBUG: Request IP:`, req.ip);

    // stderr
    // console.error(`[${new Date().toISOString()}] Error Occured:`)

    // ! Production Level Stuff
    const log = JSON.stringify({
        timestamp: new Date().toISOString(),
        level: levels[Math.floor(Math.random() * levels.length)],   // Random Level
        message: "GET /daksh endpoint called",
        headers: req.headers,
        ip: req.ip,
        service: 'daksh',
        request_id: requestId
    }) 
    fs.appendFileSync('app.log', log + '\n')
})

app.get('/shubu', (req,res) => {
    res.send("Hello Shubu");

    const requestId = uuid()

    //Generating Logs
    // console.log(`[${new Date().toISOString()}] INFO: GET /shubu endpoint called`);
    // console.log(`[${new Date().toISOString()}] DEBUG: Request headers:`, req.headers);
    // console.log(`[${new Date().toISOString()}] DEBUG: Request IP:`, req.ip);

    // stderr
    // console.error(`[${new Date().toISOString()}] Error Occured:`)

    // ! Production Level Stuff
    const log = JSON.stringify({
        timestamp: new Date().toISOString(),
        level: levels[Math.floor(Math.random() * levels.length)],   // Random Level
        message: "GET /shubu endpoint called",
        headers: req.headers,
        ip: req.ip,
        service: 'shubu',
        request_id: requestId
    })

    fs.appendFileSync('app.log', log + '\n')
})

app.listen(9001, () => console.log(`Listening on Port 9001`));