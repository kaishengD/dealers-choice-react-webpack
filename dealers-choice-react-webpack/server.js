const router = require('./api');

const express = require('express')
const {syncAndSeed } = require('./db');
const { append } = require('express/lib/response');
const path = require('path');
const port = 3000;
const app = express();
app.use('/api',require('./api'))
app.use('/dist',express.static(path.join(__dirname,'dist')));
app.get('/',(req,res)=>res.sendFile(path.join(__dirname,'index.html')))
const init = ()=>{
    try{
        syncAndSeed();
        app.listen(port,()=>{
            console.log(`listening on port ${port}`)
        })
        
    }catch(err){
        console.log(err)
    }
}

init()