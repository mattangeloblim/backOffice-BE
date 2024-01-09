require("dotenv").config()

const express = require("express")
const cors = require("cors");
const port = process.env.PORT
const app = express();

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

const BettingRoutes = require("./Router/bettingRouter")


app.use("/api", BettingRoutes)

app.listen(port, () =>{
    console.log(`App is listen on Port ${port}`)
})

