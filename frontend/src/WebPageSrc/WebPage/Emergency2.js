import React, { useEffect,useState,useRef } from 'react'
import {useSelector} from 'react-redux';
import socketIOClient from "socket.io-client";
// import mapboxgl from 'mapbox-gl';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
 

import { baseUrl } from '../Helper/baseurl';
import {ValidatePhoneNumber} from '../Helper/Validate';
import {mapboxToken} from '../token/AcessToken'
mapboxgl.accessToken = 'pk.eyJ1IjoibmlzaGFsazAxIiwiYSI6ImNra3BuNTNrajJ3ZjYycXBkeW1iYnYxZnAifQ.Icu0IIlcR3nTYtrbZneciQ';


// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
// mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

// mapboxgl.accessToken = mapboxToken

function AmbPage(props) {
    const [socketObj,setSocketObj]=useState(null);
    const [phone,setPhone]=useState(null);

    const mapContainer = useRef();
    const map = useRef(null);
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(9);
    // for making sure the number is valid
    const [disabled,setDisbaled]=useState(false);

   const location_from_store=useSelector(state=>state.LocationReducer.location);
   try{
    var location=location_from_store[0].location
   }
   catch(err){
       var location=null;
   }
   
//    useEffect(() => {
//     if (map.current) return; // initialize map only once
//     map.current = new mapboxgl.Map({
//     container: mapContainer.current,
//     style: 'mapbox://styles/mapbox/streets-v11',
//     center: [lng, lat],
//     zoom: zoom
//     });
//     });

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
          setDisbaled(true)
         
        //   show map below 

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

  const showMap=()=>{
  console.log("hello u clicked bruh")
//   get Ambulance location
socketObj.on("get_location",(location)=>{
    console.log(location)
    // assign this location to state and track
})
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
  {/* TODO replace false in disable with !disabled */}
  <button type="button" class="mt-5 btn btn-success btn-lg" onClick={showMap} disabled={false}>TRACK AMBULANCE LOCATION</button>
  </form>
            </div>
            {/* add map here for user to track the ambulance */}
            
            <div ref={mapContainer} className="mt-5 map-container" style={{ height: "400px" }} />  
            
             </div>
    )
}

export default AmbPage;
