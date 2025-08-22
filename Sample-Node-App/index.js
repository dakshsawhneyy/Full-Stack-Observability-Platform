const express = require('express')

const app = express();

app.get('/daksh', (req,res) => {
    res.send("Hello Daksh");
    
    //stdout
    console.log(`[${new Date().toISOString()}] INFO: GET /daksh endpoint called`);
    console.log(`[${new Date().toISOString()}] DEBUG: Request headers:`, req.headers);
    console.log(`[${new Date().toISOString()}] DEBUG: Request IP:`, req.ip);

    // stderr
    console.error(`[${new Date().toISOString()}] Error Occured:`)
})

app.get('/shubu', (req,res) => {
    res.send("Hello Shubu");
    //Generating Logs
    console.log(`[${new Date().toISOString()}] INFO: GET /shubu endpoint called`);
    console.log(`[${new Date().toISOString()}] DEBUG: Request headers:`, req.headers);
    console.log(`[${new Date().toISOString()}] DEBUG: Request IP:`, req.ip);

    // stderr
    console.error(`[${new Date().toISOString()}] Error Occured:`)
})

app.listen(9000, () => console.log(`Listening on Port 9000`));