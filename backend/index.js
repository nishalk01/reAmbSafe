const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors")
const http = require('http');


const app=express();
app.use(cors())

var server = http.createServer(app);
var io = require('socket.io')(server, { cors: {origin:'*'}});

require("dotenv/config")
const authRoutes=require("./routes/AuthRoutes");
const NotifyRoutes=require("./routes/NotificationRoute");
const UserSchema=require("./models/UserModel");
const NotificationSchema = require("./models/NotificationModel");







io.on('connection', (socket) => {
    const getQuery=socket.handshake
    if(getQuery.password && getQuery.id){
      // authorized

     console.log("hello authorized user")
    // also save socketId 
    // probably caching the socket instance with something like redis would be the optimized solution
    UserSchema.UserModel.updateOne({_id:getQuery.id,password:getQuery.password},{$set:{available:true,socketid:socket.id}}).then((err,doc)=>{
      console.log(doc);
      if(err) throw err
      socket.join(getQuery.id)
    }) //if sucessful join the room


    // join the room then
    }
    else{
      // join room and
      // anonymous request save notification
      socket.on("send_notify",(notification)=>{
        
        // join a room
        const amb_id=String(notification.id) //is the ambulance id
        // join the room from id
        socket.join(amb_id)
 
        // send the recieved notification in that room and save 
        UserSchema.UserModel.findOne({id:amb_id},(err,doc)=>{
          if(err) throw err
          if(doc){
            console.log(doc)
            // get socket id and send the message if the ambuser is online
          }
        })
        let notificationsaved=new NotificationSchema.NotificationModel({
          to:amb_id,
          from:notification.phoneNumber,
          emergency_location:{
            type:'Point',
            // longitude and then latitude
            coordinates:[notification.longitude,notification.latitude]
          }

                
        })
        notificationsaved.save(function(err){
          if(!err){
            socket.to(amb_id).emit("new_notification",notification)
            NotificationSchema.NotificationModel.find({})
            .populate("to")
            .exec((err,data)=>{
              console.log(JSON.stringify(data,null,'\t'))
            })
          }
        })
        
        
       console.log(notification)        

      })



    }
    
   
  });
  

mongoose.connect("mongodb://localhost/Ambsafe",{ useUnifiedTopology: true,useNewUrlParser: true },(err)=>{
    console.log("connected")
    if(err) throw err
   })

// express api setup
app.use(express.json());
app.use(express.urlencoded({extended: true}))

// all routes
app.use("/auth",authRoutes)
app.use("/notify",NotifyRoutes)


server.listen(8000,()=>{
    console.log("listening at  http://localhost:8000/")
})
