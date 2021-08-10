import React, { useEffect,useState,useRef } from 'react'
import {useSelector} from 'react-redux';
import socketIOClient from "socket.io-client";
import { Map as MapContainer, TileLayer, Marker, Popup  } from 'react-leaflet'
 
//TODO change map to leafletjs 
import { baseUrl } from '../Helper/baseurl';
import {ValidatePhoneNumber} from '../Helper/Validate';




function AmbPage(props) {
    const [socketObj,setSocketObj]=useState(null);
    const [phone,setPhone]=useState(null);
    const mapRef=useRef()

    const [ambLocation,setAmbLocation]=useState(null)
  
    // for making sure the number is valid
    const [disabled,setDisbaled]=useState(false);

    const [track,setTrack]=useState(false);

   const location_from_store=useSelector(state=>state.LocationReducer.location);
   try{
    var location=location_from_store[0].location
   }
   catch(err){
       var location=null;
   }
   
  


// make unload to avoid user from reloading also to make sure to whether user is connected or not

   useEffect(() => {
    const socket = socketIOClient(baseUrl);
    // {props.match.params.AmbId}    
    setSocketObj(socket);    
    socket.on("get_location",(pos)=>{
      try{
        console.log(pos.location)
        setAmbLocation(pos.location)
      
      }
      catch(err){
        console.log(err)
      }
      
    })
    
    return () => {
       socket.disconnect()
    }
    // write a cleanup function to disconnect connection
  }, []);


   
  
  const handleSubmit=(e)=>{
      e.preventDefault();
      if(location && ValidatePhoneNumber(phone)){
          console.log("send a socket event");
        //   send notification to server also send socketId
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

  // function LocationMarker() {
  //   const [position, setPosition] = useState(null)
  //   const map = useMapEvents({
  //     click() {
  //       map.locate()
  //     },
  //     locationfound(e) {
  //       setPosition(e.latlng)
  //       map.flyTo(e.latlng, map.getZoom())
  //     },
  //   })
  
  //   return position === null ? null : (
  //     <Marker position={position}>
  //       <Popup>You are here</Popup>
  //     </Marker>
  //   )
  // }

  
  const handleChange=(e)=>{
      if(e.target.id=="phone"){
          setPhone(e.target.value)

      }
  }

  const showMap=()=>{
  console.log(location)
  console.log(mapRef)

  setTrack(true)
//   get Ambulance location 

  }
   
    return (
        <div className="mt-5 container-fluid ">
            <div className="d-flex flex-column" style={{textAlign:"center"}}>

                
            <h3 className="mt-5" >Hello User{'\n'}{location?(<h5 className="mt-3">Got Location Acess {'\t'}  ☑️</h5>):(<h5 className="mt-3">Please allow location acess❌ </h5>)}</h3>
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


            
            <MapContainer ref={mapRef}  center={location} zoom={20}  style={{height: "800px"}} className="mt-5">
    <TileLayer
      // url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
      // url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {/* <LocationMarker /> */}

{ambLocation?(<Marker position={ambLocation}>
      <Popup>
       Ambulance location here
      </Popup>
      </Marker>):<Marker position={[13.047667,74.808565]}>
      <Popup>
       Ambulance location here
      </Popup>
      </Marker>}
    


    {location && track?( <Marker position={location}>
      <Popup>
       Your Location Now
      </Popup>
      </Marker>):null}
  </MapContainer>
            {/* add map here for user to track the ambulance */}


            {/* another marker that moves along with watever location given */}
            
            
             </div>
    )
}

export default AmbPage;
