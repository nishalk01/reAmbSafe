import React, { useEffect,useState } from 'react'
import {useSelector} from 'react-redux';
import socketIOClient from "socket.io-client";
import { baseUrl } from '../Helper/baseurl';

function AmbPage(props) {
    const [socketObj,setSocketObj]=useState(null)
   const location_from_store=useSelector(state=>state.location);
   try{
    var location=location_from_store[0].location
   }
   catch(err){
       var location=null;
   }
   


   useEffect(() => {
    const socket = socketIOClient(baseUrl);
    // {props.match.params.AmbId}    
    setSocketObj(socket);
    return () => {
       socket.disconnect()
    }
    // write a cleanup function to disconnect connection
  }, []);
   
  

   
    return (
        <div className="mt-5 container-fluid ">
            <div className="d-flex flex-column" style={{textAlign:"center"}}>

                
            <h3 >Hello User{'\n'}{location?(<h5 className="mt-3">Got Location Acess {'\t'}  ☑️</h5>):(<h5 className="mt-3">Please allow location acess❌ </h5>)}</h3>
            {'\n'}
            <h5>Please fill in your PhoneNumber</h5>
            <div class=" mt-4">
    <input type="number" id="form6Example6" placeholder="Enter Your Phone Number" />

  </div>
            </div>
        </div>
    )
}

export default AmbPage;
