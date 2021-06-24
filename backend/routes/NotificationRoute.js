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


module.exports=router;