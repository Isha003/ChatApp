var express = require('express'),
    Bourne     = require('bourne'),
    bodyParser = require('body-parser'),
    db = new Bourne('user.json'),
    crypto     = require('crypto'),
     api     = require('./routes/api'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

app
   .use(express.static('./public'))
   .use(bodyParser.json())
   .use(bodyParser.urlencoded({     // to support URL-encoded bodies
      extended: true
      }))
   .use('/api', api)
   .get('*',function(req,res){

     res.sendFile('/public/main.html' , { root : __dirname});
       
  })
      /*.listen(3000,function(err){
        if(err){
          console.log(err);
        } else{
            console.log('listening on port 3000');
          }*/
    io.on('connection',function(socket){
      console.log('a user connected');

        socket.on('disconnect', function(){
          console.log('user disconnected');
        });

        socket.on('chat', function(msg){
           console.log(msg);
         
          // broadcasting msg to all clients
              io.emit('chat', msg);

        });



    });

    http.listen(3000,function(){
      console.log('listening on  *:3000');
        
  });
