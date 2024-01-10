require("dotenv").config()

const express = require("express")
const cors = require("cors");
const port = process.env.PORT
const app = express();
const fs = require("fs")
const file = fs.readFileSync("./1CE3B0CF64F9D3933B92279E7A3F1CE2.txt")
const https = require("https")

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

const BettingRoutes = require("./Router/bettingRouter")

app.use("/api", BettingRoutes)

app.get("/.well-known/pki-validation/1CE3B0CF64F9D3933B92279E7A3F1CE2.txt", (req,res) =>{
    res.sendFile("/home/ubuntu/backOffice-BE/1CE3B0CF64F9D3933B92279E7A3F1CE2.txt")
})

app.listen(port, () =>{
    console.log(`App is listen on Port ${port}`)
})

