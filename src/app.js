const express = require('express');

const app = express();

app.use('/test',(req,res)=>{
    res.send("API Test Route")
});

app.get('/user/:userId/:name/:password',(req,res)=>{
    console.log(req.params)
    res.send({firstName:"Karthik",lastName:"N"})
});

app.post('/user',(req,res)=>{
    res.send('Data Saved Successfully to DB')
});

app.delete('/user',(req,res)=>{
    res.send('Data Deleted Successfully')
});

app.listen(3000,()=>{
    console.log("Server is Running Successfully on Port 3000")
})