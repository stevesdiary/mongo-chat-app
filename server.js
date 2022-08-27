const mongodb = require('mongodb').MongoClient;
const client = require('socket.io').sockets;
const express = require('express');
const app = express();
//cconnet to mongodb

mongodb.connect("mongodb+srv://chatapp:abc789@cluster0.jqugssm.mongodb.net/?retryWrites=true&w=majority", (err,db)=> {
   if(err){
      throw err;
   }
   console.log("MongoDB connected");

   //connect to socket.io
   client.on('connection',function(socket){
   let chat = db.collection('chats');

   // Create function to send status
      sendStatus = function(s){
         socket.emit('status', s)
      }
      //get chats from mongo collection
      chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
         if(err){
            throw err;
         }
         // Emit messages
         socket.emit('output', res);
      });
      //Handle input events
      socket.on('input', function(data){
         let name = data.name;
         let message = data.message;

         // Check name and message
         if(name == '' || message === ''){
            //send error message
            sendStatus('Please enter a name and message')
         } else {
            // insert message
            chat.insert({name: name, message: message}, function(){
               client.emit('output', [data]);

               // send status object
               sendStatus({
                  message: 'Message sent',
                  clear: true
               })
            })
         }
      })

      //Handle clear
      socket.on('clear', function(data){
         // Remove all chats from the collection
         chat.remove({}, function(){
            //Emit cleared
            socket.emit('cleared');
         })
      })
   });

});

app.listen(4000, ()=>{
   console.log("App listening on port 4000")
   
})