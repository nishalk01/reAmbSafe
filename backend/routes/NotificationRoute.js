const router  = require("express").Router();
const turf = require("@turf/turf")

const UserSchema=require("../models/UserModel");
const NotificationSchema = require("../models/NotificationModel");
const PatientSchema=require("../models/PatientForm");

const {authenticate}=require("../Helper");

router.get("/GetNotification",authenticate,(req,res)=>{
   NotificationSchema.NotificationModel.find({to:req.id},(err,doc)=>{
       if(err) throw err
       res.json(doc)
   })
    
    // NotificationSchema.NotificationModel.findOne({to:req.userid.id})
})


router.get("/GetHospitalNotification",authenticate,(req,res)=>{
    PatientSchema.PatientFormModel.find({to:req.id},(err,doc)=>{
        if(err) throw err
        res.json(doc)
    })
    
})

router.get("/allAmbulanceList",(req,res)=>{
    UserSchema.UserModel.find({role:"Ambulance"},(err,userData)=>{
        if(err) throw err
        userData.map(data=>{
            data.password=undefined;
        })
        res.json(userData)

    })
})

router.post("/averted",authenticate,(req,res)=>{
    
    NotificationSchema.NotificationModel.updateOne({socketID:req.body.socketID},{$set:{ averted:true }}).then((err,doc)=>{
        if(!err){
            res.sendStatus(200)
        }
       
    })

})



router.post("/getNearest",authenticate,(req,res)=>{
    let from=req.body.from.coordinates;
    // get  the location coordinates and check nearest
  let from_coordinate= turf.point( [Number(from[1]),Number(from[0])])
  const arrofCoordinates=[]
  UserSchema.HospitalModel.find({},(err,userData)=>{
      if(!err){
         userData.forEach(data=>{
             arrofCoordinates.push(turf.point(data.hospitalLocation.coordinates))
         })
        let points= turf.featureCollection(arrofCoordinates);
        let nearest=turf.nearestPoint(from_coordinate,points)
        let geometry=nearest.geometry
        let distanceinKm=nearest.properties.distanceToPoint
        UserSchema.HospitalModel.findOne({hospitalLocation:geometry},(err,doc)=>{
            if(doc){
              
                res.json({"location":doc.hospitalLocation.coordinates,"distance":distanceinKm,"HospitalId":doc.user,"HospitalName":doc.hospitalName})
            }
        })
       
        

}})
})


router.post("/getNearestCircle",(req,res)=>{
    UserSchema.CircleModel.find({},(err,userData)=>{
        if(!err){
            // repeating the above code 
            const arrofCircleCoordinates=[]
            console.log(req.body.fromLocation)
            let fromLoc =[req.body.fromLocation[1], req.body.fromLocation[0]]
            let  fromCoordinate=turf.point(fromLoc);
            console.log(fromLoc)
            let ambID=req.ambid;
            userData.forEach(data=>{
                arrofCircleCoordinates.push(turf.point(data.circleLocation.coordinates))
            })
            let allpoints=turf.featureCollection(arrofCircleCoordinates);
            let nearestCircle=turf.nearestPoint(fromCoordinate,allpoints);
            console.log(nearestCircle)
            let geometry=nearestCircle.geometry
            let distinKm=nearestCircle.properties.distanceToPoint;
            console.log(distinKm)
            if(distinKm<1){
                // get a phoneNumber send a message to circle and set MessageSentToTrue

                console.log(`A ambulance is arriving to this circle with a destination Location of `)
                UserSchema.CircleModel.updateOne({ambuser:ambID,circleLocation:geometry},{$set:{ messageSent:true }})
                .then((err,doc)=>{
                  if(err) throw err
                  if(doc){
                      console.log(doc)
                      
                  }
                })



            }
            res.sendStatus(200);
       

        }
    })

})


module.exports=router;