import React, { useEffect,useState } from 'react'
import {useSelector} from 'react-redux';
import socketIOClient from "socket.io-client";
import { baseUrl } from '../Helper/baseurl';
import {ValidatePhoneNumber} from '../Helper/Validate';

function AmbPage(props) {
    const [socketObj,setSocketObj]=useState(null);
    const [phone,setPhone]=useState(null);

    // for making sure the number is valid
    const [disabled,setDisbaled]=useState(false);

   const location_from_store=useSelector(state=>state.LocationReducer.location);
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
   
  
  const handleSubmit=(e)=>{
      e.preventDefault();
      if(location && ValidatePhoneNumber(phone)){
          console.log("send a socket event");
        //   send notification to server 
        console.log(location.longitude)
          socketObj.emit("send_notify",{
               id:props.match.params.AmbId,
               phoneNumber:String(phone),
               longitude:location[0],
               latitude:location[1]
          })

      }
      else{
       alert("Please make sure Mobile number is valid and location is acessible")
      }

  }
  const handleChange=(e)=>{
      if(e.target.id=="phone"){
          setPhone(e.target.value)

      }
  }
   
    return (
        <div className="mt-5 container-fluid ">
            <div className="d-flex flex-column" style={{textAlign:"center"}}>

                
            <h3 >Hello User{'\n'}{location?(<h5 className="mt-3">Got Location Acess {'\t'}  ☑️</h5>):(<h5 className="mt-3">Please allow location acess❌ </h5>)}</h3>
            {'\n'}
            <h5>Please fill in your PhoneNumber</h5>
            <form onSubmit={handleSubmit}>
            <div class=" mt-4">
    <input type="number" className="" id="phone" placeholder="Enter Your Phone Number" onChange={handleChange} />
    <button type="submit" class="btn btn-primary btn-rounded" disabled={disabled}>SEND</button>
  </div>
  </form>
            </div>
        </div>
    )
}

export default AmbPage;
