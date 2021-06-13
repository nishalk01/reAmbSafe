import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import '../assets/Login.css'
import { axiosInstance } from '../Helper/baseurl'
import { getTimeDifference } from '../Helper/CacluteTime'

// dynamically changing className src:https://www.andreasreiterer.at/dynamically-add-classes/

function HomePage() {
    const [allNotification,setAllNotification]=useState([]);
    const [location,setLocation]=useState([]);
    // make a reques to get all notification at beginning
    const getDistance=(to)=>{
        try{
            const turf = window.turf;
            var fromt=turf.point(location);
            var tot=turf.point(to);
            var top=turf.point([74,13])
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
            console.log(res.data)
            setAllNotification(res.data)
            console.log(location)
            
        })
        .catch(err=>{
            console.log(err)
        })

    },[])

    const displayNotification=allNotification.length?(
        allNotification.map(oneNotification=>{
            return(
                 
               
                <div className={`card  col-lg-8 col-md-10 mt-4 text-light hover-shadow ${oneNotification.averted?"back2earth":"burningOrange"} burningOrange rounded`}  style={{ textAlign:"center" }}>
            <div className="card-body">
                <h5 className="card-title">from: {oneNotification.from}</h5>
                <p className="card-text">
                 <strong>  {getDistance([oneNotification.emergency_location.coordinates[0],oneNotification.emergency_location.coordinates[1]])}</strong> miles away
                 

                </p>
                <button type="button" className="btn btn-primary btn-rounded">Accept and Navigate</button>
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
                {/* card start emergency*/}
                {displayNotification}

            {/* <div className="card  col-lg-8 col-md-10 mt-4 text-light hover-shadow burningOrange rounded " >
            <div className="card-body">
                <h5 className="card-title">Place</h5>
                <p className="card-text">
                 Approximate time and place of emergency 
                </p>
                <button type="button" className="btn btn-primary btn-rounded">Navigate</button>
            </div>
            <div className="card-footer ">2 days ago</div>
            </div> */}
            {/* card end emergency */}

           {/* card start safe */}
            {/* <div className="card col-lg-8 col-md-10 mt-4 text-dark hover-shadow back2earth rounded">
            <div className="card-body">
                <h5 className="card-title">Place</h5>
                <p className="card-text">
                 Approximate time and place of emergency 
                </p>
                <button type="button" className="btn btn-primary btn-rounded">Navigate</button>
            </div>
            <div className="card-footer ">2 days ago</div>
            </div> */}
            {/* card end safe */}


            </div>
            </div>
            
    
            
           
            
        </div>
    )
}

export default HomePage
