import React, { useEffect, useState } from 'react'
import {useSelector,useDispatch} from 'react-redux';

import '../assets/Login.css'
import { axiosInstance } from '../Helper/baseurl'
import { getTimeDifference } from '../Helper/CacluteTime'


function addMeterToLocation(meters,my_lat,my_long){
    //This function src :https://stackoverflow.com/questions/7477003/calculating-new-longitude-latitude-from-old-n-meters
const coef = meters * 0.0000089;

const  new_lat = my_lat + coef;

// pi / 180 = 0.018
const  new_long = my_long + coef / Math.cos(my_lat * 0.018);

return {new_long,new_lat}
}

// dynamically changing className src:https://www.andreasreiterer.at/dynamically-add-classes/

function HomePage() {
    const [allNotification,setAllNotification]=useState([]);
    const [location,setLocation]=useState([]);
    // get all notification stored in the store 
    const notification_from_store=useSelector(state=>state.NotificationReducer.new_notification);
    const socketObj=useSelector(state=>state.SocketConnectionReducer.socketObj);
    // for testing purpose
    const [watchPositionID,setWatchPositionID]=useState(null);
  

    useEffect(()=>{
       setAllNotification(allNotification=>notification_from_store.concat(allNotification))
    },[notification_from_store])

    const getDistance=(to)=>{
        try{
            const turf = window.turf;
            var fromt=turf.point(location);
            var tot=turf.point(to);
            var options = {units: 'miles'};
            var distance=Math.round(turf.distance(fromt,tot,options)) 
            return String(distance)
        }
        catch(err){
            console.log(err);
            return " "
        }
       


    }
    useEffect(()=>{
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition((position)=>{
                setLocation([position.coords.latitude,position.coords.longitude])
            });
            
        }
        else{
            alert("Your browser doesnot support geolocation")
        }

        axiosInstance.get("notify/GetNotification")
        .then(res=>{
            setAllNotification(res.data) 
        })
        .catch(err=>{
            console.log(err)
        })

    },[])

    // useEffect(()=>{
      
    // },[toggleLocation])

    const sucess=(pos)=>{
        let {new_long,new_lat}=addMeterToLocation(10,pos.coords.latitude,pos.coords.longitude);
        console.log(pos)
        socketObj.emit("ambLocation",{
            "latitude":new_lat,
            "longitude":new_long,
            "id":localStorage.getItem("id")
        });

    }
    const errors=(err)=>{
        console.log(err)
    }
    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };

    const acceptEmergencyCall=()=>{
         // alert the use who sent the emergency and also pass ur location to be tracked 

        //watchPosition Usage:  https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition

        //  const id=navigator.geolocation.watchPosition(sucess,errors,options);
        //  setWatchPositionID(id)
        console.log("message emitted");
        
        socketObj.emit("ambLocation",{
            "latitude":"something",
            "longitude":"something",
            "id":localStorage.getItem("id")
        });
        // set averted to true so other dont get alerted 
       
        
    }

    const CancelWatch=()=>{
        navigator.geolocation.clearWatch(watchPositionID);
        console.log("Cancel watch")

    }

    const displayNotification=allNotification.length?(
        allNotification.map(oneNotification=>{
            // if(oneNotification.from){
                return(  
                    <div className={`card  col-lg-8 col-md-10 mt-4 text-light hover-shadow ${oneNotification.averted?"back2earth":"burningOrange"} burningOrange rounded`}  style={{ textAlign:"center" }}>
                <div className="card-body">
                    <h5 className="card-title">from: {oneNotification.from}</h5>
                    <p className="card-text">
                     <strong>  {getDistance([oneNotification.emergency_location.coordinates[0],oneNotification.emergency_location.coordinates[1]])}</strong> miles away
                    </p>
                    <button type="button" className="btn btn-primary btn-rounded" onClick={acceptEmergencyCall}>Accept and Navigate</button>
                </div>
                <div className="card-footer">{getTimeDifference(oneNotification.when)} ago</div>
                </div>
                )
        })
    ):null
    return (
        <div>
           
            <div className="container-fluid">
            <div className="row justify-content-md-center">
            <button type="button" class="btn btn-danger" onClick={CancelWatch}>CANCEL WATCH(dev purpose)</button>
                {/* card start emergency*/}
                {displayNotification}
            </div>
            </div>       
        </div>
    )
}

export default HomePage
