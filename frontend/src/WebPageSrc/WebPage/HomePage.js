import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux';
import { useHistory } from "react-router-dom";


import '../assets/Login.css'
import { axiosInstance } from '../Helper/baseurl'
import { getTimeDifference } from '../Helper/CacluteTime'
import {getDistance} from '../Helper/Validate'


// dynamically changing className src:https://www.andreasreiterer.at/dynamically-add-classes/

function HomePage() {
    const [allNotification,setAllNotification]=useState([]);
    const [location,setLocation]=useState([]);
    // get all notification stored in the store 
    const notification_from_store=useSelector(state=>state.NotificationReducer.new_notification);
    // for testing purpose

    const history=useHistory()
  

    useEffect(()=>{
       setAllNotification(allNotification=>notification_from_store.concat(allNotification))
    },[notification_from_store])

  


    
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
        console.log(pos)
        // socketObj.emit("ambLocation",{
        //     "latitude":new_lat,
        //     "longitude":new_long,
        //     "id":localStorage.getItem("id")
        // });

    }
    const errors=(err)=>{
        console.log(err)
    }
    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };


    const acceptEmergencyCall=(socketID,emergency_location,Ephone)=>{

        // go to navigate page

    history.push({
        pathname:`/navigate/${socketID}`,
        state:{Elocation:emergency_location,Ephone:Ephone}
    })
         // alert the use who sent the emergency and also pass ur location to be tracked  

        //watchPosition Usage:  https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition

        //  const id=navigator.geolocation.watchPosition(sucess,errors,options);
        //  setWatchPositionID(id)


        // faking watchPosition 
        console.log("message emitted");
        
       
        // set averted to true so other dont get alerted 
       
        
    }

   

    const displayNotification=allNotification.length?(
        allNotification.map(oneNotification=>{
            // if(oneNotification.from){
                return(  
                    <div className={`card  col-lg-8 col-md-10 mt-4 text-light hover-shadow ${oneNotification.averted?"back2earth":"burningOrange"} burningOrange rounded`}  style={{ textAlign:"center" }} key={oneNotification.socketID}>
                <div className="card-body">
                    <h5 className="card-title">from: {oneNotification.from}</h5>
                    <p className="card-text">
                     <strong>  { Math.round(getDistance([oneNotification.emergency_location.coordinates[0],oneNotification.emergency_location.coordinates[1]],location)) }</strong> km away
                    </p>
                    <button type="button" 
                    className="btn btn-primary btn-rounded" 
                    onClick={()=>{acceptEmergencyCall(oneNotification.socketID,oneNotification.emergency_location,oneNotification.from)}} disabled={false}>Accept and Navigate</button>
                </div>
                <div className="card-footer">{getTimeDifference(oneNotification.when)} ago</div>
                </div>
                )
        })
    ):(<h1 style={{  textAlign:"center"}}>No notification yet</h1>)
    return (
        <div>
           
            <div className="container-fluid">
            <div className="row justify-content-md-center">
           
                {/* card start emergency*/}
                {displayNotification}
            </div>
            </div>       
        </div>
    )
}

export default HomePage
