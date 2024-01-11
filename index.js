require("dotenv").config()

const express = require("express")
const cors = require("cors");
const port = process.env.PORT
const app = express();
const fs = require("fs")
const key = fs.readFileSync("private.key")
const cert = fs.readFileSync("certificate.crt")
const https = require("https")

const cred = {
    key, 
    cert
}

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

const BettingRoutes = require("./Router/bettingRouter")

app.use("/api", BettingRoutes)

app.listen(port, () =>{
    console.log(`App is listen on Port ${port}`)
})

const httpsServer = https.createServer(cred,app)
httpsServer.listen(process.env.HTTPSPORT)
