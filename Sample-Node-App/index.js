const express = require('express')
const {v4:uuid} = require('uuid')
const fs = require('fs')
const client = require('prom-client')
const responseTime = require('response-time')

// Loki
const { createLogger, transports } = require("winston");
const LokiTransport = require("winston-loki");

// Sending data to LOKI
const options = {
  transports: [
    new LokiTransport({
      host: "http://3.111.23.106:3100"
    })
  ]
};
const logger = createLogger(options);   // we can add logs inside this logger

const app = express();

// This collects default metrics like ram, cpu etc
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register })

// Creating Histogram of this route
const reqResTime = new client.Histogram({
    name: 'http_req_res_time',
    help: 'Request Response Time',
    labelNames: ['method', 'route', 'code'],
    buckets: [1,50,100,200,500,800,1000,2000]  // buckets are used to categorize the time taken
})

// Creating metric for counter
const totalReqCounter = new client.Counter({
    name: 'total_req',
    help: 'Total number of requests',
})

// Custom Metrics Route
// This will tell the requests take how much time -- apply on each request
app.use(responseTime((req, res, time) => {
    reqResTime.labels({ method: req.method, route: req.url, code: req.statusCode }).observe(time)
    totalReqCounter.inc()
}))

const levels = ["info", "debug", "error", "warn", "critical"]

app.get('/', (req,res) => {
    res.send("Hello Beautiful");
    logger.error("Req came on / route")
})

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
    logger.info(log)
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
    logger.info(log)
})

// Prometheus Metrics Route -- exposing the metrics
app.get('/metrics', async (req,res) => {
  res.setHeader('Content-Type', client.register.contentType);
  const metrics = await client.register.metrics();
  res.send(metrics);
})

app.listen(9000, () => console.log(`Listening on Port 9000`));
