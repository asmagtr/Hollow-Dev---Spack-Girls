const express =require('express')
const app = express()

const path = require('path')
const http = require('http')
const {Server}=require('socket.io')
const { Socket } = require('engine.io')
//
const server=http.createServer(app)
const io= new Server(server)


let arr=[]
let playingArr=[]


app.use(express.static(path.resolve('')))

io.on('connect',(socket)=>{
    socket.on('search',(tmp)=>{
        if(!tmp.e){
            arr.push(tmp.name)
            if(arr.length>=2){
                let firstPlayer={
                    firstPlayerName:arr[0],
                    firstPlayerMove:"",
                    firstPlayerValue:"X"
                }
                let secondPlayer={
                    secondPlayerName:arr[1],
                    secondPlayerMove:"",
                    secondPlayerValue:"O"
                }

                let players={
                    firstPlayer,
                    secondPlayer
                }
                playingArr.push(players)
                arr.splice(0,2)
                io.emit('search',{allPlayers:playingArr})
            }
        }
    })
})

app.get('/',(req,res)=>{
    return res.sendFile("index.html")
})


server.listen(3000,()=>{
    console.log('port connected to 3000')
})