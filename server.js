const mongodb = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets;

//cconnet to mongodb

mongo.connect()