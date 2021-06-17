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

   
    const getQuery=socket.handshake.query
    
    if(getQuery.password && getQuery.id){
      // socket.join(String(getQuery.id))

      socket.on("ambLocation",(pos)=>{
        //  also pass id to make sure u send to proper room
      socket.to(pos.socketID).emit("get_location",pos)
      // socket.to(pos.id).emit("get_location",pos)

       })
      
 

      // console.log(`This userId ${getQuery.id} This is your password ${getQuery.password} `)
      // authorized

    //  console.log(`hello authorized user with socketId ${socket.id}`)
    
    // also save socketId 
    // probably caching the socket instance with something like redis would be the optimized solution
    UserSchema.UserModel.updateOne({_id:getQuery.id,password:getQuery.password},{$set:{available:true,socketid:socket.id}}).then((err,doc)=>{
      
      if(err) {
        console.log(err)
        }
      socket.join(getQuery.id)
    })
    //if sucessful join the room
    socket.on("set_available",(userdata)=>{
      // when user disconnects make available false and also SocketID null
     UserSchema.UserModel.updateOne({password:userdata.password,
      phoneNumber:userdata.phoneNumber},{$set:{available:false,socketid:null}})
      .then((err,doc)=>{
        if(err){
          console.log(err)
        }
      })
     
    })
    // join the room then
    }
    else{

     
      // console.log("A anonymous user has connected")
      // join room and
      // anonymous request save notification
      socket.on("send_notify",(notification)=>{
        // console.log(notification)
        // join a room
        console.log(socket.id)

        const amb_id=String(notification.id) //is the ambulance id
        // join the room from id
        socket.join(amb_id)
 
        // send the recieved notification in that room and save 
        UserSchema.UserModel.findOne({id:amb_id},(err,doc)=>{
          if(err) throw err
          if(doc){
            // console.log(doc)
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
          },
          socketID:String(socket.id)

                
        })
        notificationsaved.save(function(err){
          if(!err){
            socket.to(amb_id).emit("new_notification",notificationsaved)
            
          }
        })
        
        

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
