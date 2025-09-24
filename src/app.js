const express = require('express');

const app = express();

app.use('/test',(req,res)=>{
    res.send("API Test Route")
})

app.use('/',(req,res)=>{
    res.send('API Server')
})

app.listen(3000,()=>{
    console.log("Server is Running Successfully on Port 3000")
})