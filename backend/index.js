const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors")
const http = require('http');


const app=express();
app.set('view engine', 'ejs');

const min=5;


setInterval(()=>{
// set every messageSent to False
console.log("changed the  field")
UserSchema.SendOnceModel.updateMany({},{$set:{messageSent:false}},(err,res)=>{
  console.log(res)
})


},min*60000)


app.get("/fillDetails",(req,res)=>{
  UserSchema.RoleModel.find({},(err,userData)=>{
  //  callback hell
    UserSchema.HospitalModel.find({},(err,data)=>{
      UserSchema.CircleModel.find({},(err,circleData)=>{
        if(circleData){
          res.render('index',{"allUser":userData,"HospitalData":data,"CircleData":circleData})

        }
      })
     


    })

  })
  
})




app.use(cors())

var server = http.createServer(app);
var io = require('socket.io')(server, { cors: {origin:'*'}});

require("dotenv/config")
// routes 
const authRoutes=require("./routes/AuthRoutes");
const NotifyRoutes=require("./routes/NotificationRoute");

// models
const UserSchema=require("./models/UserModel");
const NotificationSchema = require("./models/NotificationModel");
const PatientFormSchema=require("./models/PatientForm");







io.on('connection', (socket) => {

   
    const getQuery=socket.handshake.query
    
    if(getQuery.password && getQuery.id){
      // socket.join(String(getQuery.id))

      socket.on("ambLocation",(pos)=>{
        //  also pass id to make sure u send to proper room
      socket.to(pos.socketID).emit("get_location",pos)
      // socket.to(pos.id).emit("get_location",pos)

       })
      

       socket.on("ambLocationHospital",(ambLocation)=>{
         socket.to(ambLocation.HospitalId).emit("locationToHospital",ambLocation);
       })
 

      //TODO authorize user 
socket.on("FormNotification",(formData)=>{
  UserSchema.UserModel.findOne({_id:getQuery.id,password:getQuery.password},(err,doc)=>{
    if(doc){
      //  save notification
    
      const formsaved=PatientFormSchema.PatientFormModel({
        from:getQuery.id,
        // to:formData.HospitalId,
        to:formData.HospitalId,
        contact:formData.PhoneNumber,
        Pname:formData.name,
        Severity: Number(formData.Severity),
        Age: Number(formData.age),
        PatientDesc:formData.PatientDesc,


      })
      formsaved.save((err)=>{
        if(err){
          throw err
        }
        else{
          // get socketid and 
          // UserSchema.UserModel.findOne({})
          console.log(formsaved)
          // socket.join(formsaved.to) //doesnt seem to work
          // socket.to(formsaved.to).emit("HospitalNotification",formsaved)
          UserSchema.UserModel.findOne({_id:formsaved.to},(err,doc)=>{
            if(err){
              throw err
            }
            else if(doc){
              socket.to(doc.socketid).emit("HospitalNotification",formsaved)
              console.log(doc)
            }
          })
        }
        
      })
    }
    else if(err){
      console.log(err)
    }

  })

})

// socket.on("checkNearestCircle",(location)=>{
//   // get nearest location 

// })
    
     
    
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
        // UserSchema.UserModel.findOne({id:amb_id},(err,doc)=>{
        //   if(err) throw err
        //   if(doc){
        //     // console.log(doc)
        //     // get socket id and send the message if the ambuser is online
        //   }
        // })
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

app.post("/saveRole",(req,res)=>{
  let {PhoneNumber,role}=req.body
  UserSchema.RoleModel.create({phoneNumber:String(PhoneNumber),role:String(role)},(err,doc)=>{
    if(err) throw err ;

  })
  
  res.redirect("/fillDetails")
})


app.post("/savelocation",(req,res)=>{
  console.log(req.body)
  let {longitude,latitude,phoneNumber,adress}=req.body
  
 UserSchema.UserModel.findOne({phoneNumber:String(phoneNumber)},(err,doc)=>{
   if(doc){
    console.log(doc)
   let hospitalData=UserSchema.HospitalModel({
     user:doc._id,
     hospitalName:String(adress),
     hospitalLocation:{
       type:'Point',
       coordinates:[Number(longitude),Number(latitude)]
     }
   })
   hospitalData.save(function(err){
     if(err){
       console.log(err)
     }
     if(!err){
      res.redirect("/fillDetails")

     }

   })



   }
   else if(err){
     res.sendStatus(404)
   }
 })

})

app.post("/savelocationCircle",(req,res)=>{
  console.log(req.body);
  let {longitudeCircle,latitudeCircle,CirclephoneNumber,Circleadress}=req.body;
  UserSchema.CircleModel.create({
    phoneNumber:String(CirclephoneNumber),
    circleName:String(Circleadress),
    circleLocation:{
      type:'Point',
      coordinates:[Number(longitudeCircle),Number(latitudeCircle)]
    }



  },(err,doc)=>{
   
    if(doc){
      res.redirect("/fillDetails")
    }
    else{
      res.sendStatus(500)
    }

  })
  
})

// all routes
app.use("/auth",authRoutes)
app.use("/notify",NotifyRoutes)


server.listen(8000,()=>{
    console.log("listening at  http://localhost:8000/")
})
