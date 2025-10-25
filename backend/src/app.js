const express = require('express');
const aiRoutes = require("./routes/ai.routes")
const cors = require('cors')

const app = express(); // server create

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/',(req,res)=>{
    res.send("Hello");
})

app.use('/ai',aiRoutes)
module.exports = app