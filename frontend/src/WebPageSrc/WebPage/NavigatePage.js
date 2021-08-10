import React,{useEffect,useState,useRef} from 'react'
import {useSelector} from 'react-redux';
import { Map as MapContainer, 
    TileLayer, 
    Marker, 
    Popup,
  Polyline,CircleMarker  } from 'react-leaflet'

import {waypoints} from '../token/AcessToken'
import {swapLatLng} from '../Helper/Validate'
import { getDistance } from '../Helper/Validate';
import '../assets/pulse.css'
import { axiosInstance, baseUrl } from '../Helper/baseurl';
import axios from 'axios';
import {mapboxToken} from '../token/AcessToken'

const limeOptions = { color: 'red' }

var counter=0
var timeout;
var waypointcoordinates=waypoints.routes[0].geometry.coordinates;
var nearestCircleTimeout=undefined;
const avoidRunningCounter=0;


// const after_change=coordinates.map(coordinate=>{
//     [coordinate[0], coordinate[1]] = [coordinate[1], coordinate[0]];
// })

// var coordinates=SwapArr(coordinates)


// is loading from heap memory thats y is not getting swapped

function stopTimeout(){
    counter=0
   
}


function NavigatePage(props) {
    
    const [watchPositionID,setWatchPositionID]=useState(null);
    const [currentPosition,setCurrentPosition]=useState([0,0])
    const [zoom,setZoom]=useState(20);
    const [disabled,setdisabled]=useState(true);

    // form states
    const [pname,setPName]=useState(null);
    const [plname,setPLname] =useState(null);

    const [severity,setSeverity]=useState(null);
    const [ageGroup,setAgeGroup]=useState(null);
    const [pDesc,setPDesc]=useState(null);

   const [nearestData,setNearestData]=useState(null);
   
   const [coordinates,setCoordinates]=useState(swapLatLng(waypointcoordinates))

  //  const [userID,setUserID]=useState(localStorage.getItem("id"))
  let userID=localStorage.getItem("id");
   const [intevalObj,setIntervalObj]=useState(null);

    const socketObj=useSelector(state=>state.SocketConnectionReducer.socketObj);


    // src : https://overreacted.io/making-setinterval-declarative-with-react-hooks/  
     //i dont have clear idea wat this hook does 😅 but 
    //  1) it makes sures the setInterval uses recent state 2) also make sure to avoid calling the interval more than once
    function useInterval(callback, delay) {
      const savedCallback = useRef();
    
      // Remember the latest callback.
      useEffect(() => {
        savedCallback.current = callback;
      }, [callback]);
    
      // Set up the interval.
      useEffect(() => {
        function tick() {
          savedCallback.current();
        }
        if (delay !== null) {
          let id = setInterval(tick, delay);
          return () => clearInterval(id);
        }
      }, [delay]);
    }

   
    useEffect(() => {

      // set the averted to true 
      // TODO combine both of em in backend
        axiosInstance.post(baseUrl+"notify/averted",{
          "socketID":String(props.match.params.SocketId)
        })
        .then(res=>{
          console.log(res.status)
        })
        .catch(err=>{
          console.log(err)
        })

        axiosInstance.post(baseUrl+"notify/getNearest",{
          "from":props.location.state.Elocation
        })
        .then(res=>{
          setNearestData(res.data)
        })
        .catch(err=>{
          console.log(err)
        })
        
        // get waypoint to spot there is an emeregency 
        // const url="https://api.mapbox.com/directions/v5/mapbox/driving/"+ +";"+props.location.state.Elocation+"?geometries=geojson&access_token="+ACESS_TOKEN
        // axios.get("")
       

        let timeout=setInterval(()=>{
            //    emit the message
    
            socketObj.emit("ambLocation",{
                // also get the socketID and send 
                "location":coordinates[counter],
                "id":localStorage.getItem("id"),
                "socketID":props.match.params.SocketId
            });
            if(coordinates[counter]!=undefined){
                // constantly  check if two coordinates path distance is less than some meters 
                if(getDistance(coordinates[counter],coordinates[coordinates.length-1])<1){
                  setdisabled(false);
                    console.log("You are close to the emergency location (highlight the button for the form)")
                }
                setCurrentPosition(coordinates[counter])
            }
              
               counter=counter+1
               if(counter>coordinates.length){
    
                stopTimeout()
                clearInterval(timeout)
                // stop the emit

            }
                // emit route location every 2 seconds
            },2000)

            return () => {
                  clearInterval(nearestCircleTimeout)
                 }
             
    }, [])


   

    useInterval(()=>{

      axiosInstance.post("notify/getNearestCircle",{   
        fromLocation:currentPosition,
         ambid:userID,

       }).then(res=>{
         console.log(res.status)
        
    
       })
       .catch(err=>{
         console.log(err)
       })
    },1000)


   


    const CancelWatch=()=>{
        clearInterval(timeout)
        stopTimeout()
       
        navigator.geolocation.clearWatch(watchPositionID);

    }


  const handleChange=(e)=>{
    if(e.target.id==="p_name"){
      setPName(e.target.value)
    }
    else if(e.target.id==="pl_name"){
      setPLname(e.target.value)
    }
    else if(e.target.id==="severity"){
      setSeverity(e.target.value)

    }
    else if(e.target.id==="age"){
      setAgeGroup(e.target.value)

    }
    else if(e.target.id==="patient_desc"){
      setPDesc(e.target.value)

    }

  }
  
  // const checkNearestCircle=()=>{
  //   nearestCircleTimeout=setInterval(()=>{

  //      axiosInstance.post("notify/getNearestCircle",{   
  //        fromLocation:currentPosition,
  //         ambid:userID,
  //        // destinationName:nearestData.HospitalName
 
  //       }).then(res=>{
  //         console.log(res.status)
         
     
  //       })
  //       .catch(err=>{
  //         console.log(err)
  //       })
      
       

     
  //   },5000)
  // }


  const handleSubmit=(e)=>{
    // submit form and set path to closest hospital 
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((pos)=>{
          console.log(props.location.state.Elocation)
          const currentLocation=[pos.coords.longitude,pos.coords.latitude]

          const locationInlatlong=props.location.state.Elocation.coordinates;
          const fromLocation=[locationInlatlong[1],locationInlatlong[0]]
          const url="https://api.mapbox.com/directions/v5/mapbox/driving/"+fromLocation +";"+nearestData.location +"?geometries=geojson&access_token="+mapboxToken
          axios.get(url).then(res=>{
           const distanceWaypoints=res.data.routes[0].geometry.coordinates
           const afterswapLatLng=swapLatLng(distanceWaypoints);
         setCoordinates(afterswapLatLng)


        //  faking the hospital route path for demo
         var newcounter=0
         var timeInterval=setInterval(()=>{
            // send new coordinates 
            if(afterswapLatLng[newcounter]!=undefined){
              // constantly  check if two coordinates path distance is less than some meters send this to hospital client
              socketObj.emit("ambLocationHospital",{
                location:afterswapLatLng[newcounter],
                HospitalId:String(nearestData.HospitalId)
              })
              if(getDistance(afterswapLatLng[newcounter],afterswapLatLng[afterswapLatLng.length-1])<1){
                setdisabled(false);
                  console.log("You are close to the Hospital)")
              }
              setCurrentPosition(afterswapLatLng[newcounter])
          }
            
          newcounter=newcounter+1
             if(newcounter>afterswapLatLng.length){
  
              stopTimeout()
              clearInterval(timeInterval)
              // stop the emit

          }

         },900)
          //  faking the hospital route path for demo
           
          })
          .catch(err=>{
            console.log(err)
          })
        })
    }
    else{
      alert("Your browser doesnt support geolocation")
    }
    e.preventDefault()
    const {Elocation,Ephone}=props.location.state
    if(severity && ageGroup && Elocation && Ephone){
      let full_name;

      if(pname){
        if(plname){
           full_name=`${pname} ${plname}`
        }
        else{
           full_name=`${pname}`
        }
        
      }
      else{
         full_name=null;
      }

      // emit an event with patient details
       socketObj.emit("FormNotification",{
        HospitalId:String(nearestData.HospitalId),
        PhoneNumber:Ephone,
        name:full_name,
        Severity:severity,
        age:ageGroup,
        PatientDesc:pDesc,

       })

      // use the location to get the wayPoints whch will further be used
      // axios.get("")
    }

  }

    return (
        <div>
            <div
  class="modal fade"
  id="exampleModal"
  tabindex="-1"
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Please fill this form will be sent to Hospital</h5>
        <button
          type="button"
          class="btn-close"
          data-mdb-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body ">
   <form>
      <div class="input-group mb-3 d-flex flex-column" >
        <div className="d-inline-flex ">
        <input type="text" class="form-control  py-2 "  id="p_name" onChange={handleChange} autoComplete={false} placeholder="Patient_Name(optional)" aria-label="Phone number"
    aria-describedby="button-addon2" />
     <input type="text" class="form-control  py-2 "  id="pl_name"  onChange={handleChange} autoComplete={false} placeholder="Patient L.Name(optional)" aria-label="Phone number"
    aria-describedby="button-addon2" />
      </div>


{/* severity start  */}
<div>
<select id="severity" class="form-select mt-3" value={severity} onChange={handleChange}>
  <option  selected disabled={true} >Select Severity</option>
  <option  value="1">Low</option>
  <option value="2">Medium</option>
  <option value="3">Critical</option>
  <option value="4">Severe</option>
</select>

</div>
{/* end severity */}


{/* start age select  */}
<div>
<select  id="age" className="form-select mt-3" value={ageGroup} onChange={handleChange}>
 <option selected disabled={true} > Choose your option</option>
            <option value="1">5-10</option>
            <option value="2">11-15</option>
            <option value="3">16-20</option>
            <option value="4">21-25</option>
            <option value="5">26-30</option>
            <option value="6">31-35</option>
            <option value="7">36-40</option>
            <option value="8">41-45</option>
            <option value="9">46-50</option>
            </select>

</div>
{/* end age select  */}


{/* patient desc  */}
<div>
<textarea className="form-control mt-4" id="patient_desc" onChange={handleChange}   aria-label="With textarea" placeholder="Fill in patient Description"></textarea>
</div>
{/* end patientDesc */}

{nearestData?(<div className="container-fluid mt-5">
 <div>Selected Hospital</div> <br/>
 <h6>{nearestData.HospitalName}</h6><br/>
 <div >At a distance of <strong>{ Math.round(nearestData.distance*100)/100} km </strong>  </div>

</div>):null}
  
  </div>

  
  </form>
  
  
 


      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-mdb-dismiss="modal" onClick={handleSubmit}>
          SEND
        </button>
      </div>
    </div>
  </div>
</div>
            
             <MapContainer center={currentPosition} zoom={zoom} zoomControl={false} scrollWheelZoom={false} style={{height: "100vh"}}>
                 <div style={{zIndex:"999",position:"absolute"}}>

                 <div className="d-inline-flex flex-column m-3">
                   
                <button 
                type="button" 
                className="btn btn-primary btn-lg btn-rounded mb-1" 
                onClick={() => setZoom(zoom + 1)}>
                <i class="fa fa-search-plus" aria-hidden="true"></i>
                </button>

                <button type="button" className="btn btn-primary btn-lg btn-rounded" 
                onClick={() => setZoom(zoom - 1)}>
                <i class="fa fa-search-minus" aria-hidden="true"></i>
                </button>
                 </div>

                 
           
                 </div>

             
                 
                

            
             
    <TileLayer
      // url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
      // url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
       <CircleMarker center={currentPosition} pathOptions={limeOptions} radius={20}>
      <Popup>Popup in CircleMarker</Popup>
    </CircleMarker>
 <Polyline pathOptions={limeOptions} positions={coordinates} />


   <Marker position={currentPosition}  >
      <Popup>
       Your Location Now
      </Popup>
      </Marker>
            <button type="button" 
            class={`btn btn-primary btn-rounded btn-lg ${!disabled?"pulse-primary":""} float-sm-right`} 
            data-mdb-toggle="modal"
            data-mdb-target="#exampleModal"
            style={{ zIndex:"1000",position:"absolute",bottom:"45px",right:"50%" }} disabled={false}><i class="fa fa-wpforms" aria-hidden="true"></i>
            </button>
            <button type="button" class="btn btn-danger "
             style={{ zIndex:"1000",position:"absolute",bottom:"105px",left:"50%" }} 
             onClick={CancelWatch}>CANCEL WATCH(dev purpose)</button>

             {/* below button for start looking for nearest circle every few seconds */}
                {/* <div style={{zIndex:"999",position:"relative",float:"right"}}>
                <button 
                  type="button" 
                  className="btn btn-warning btn btn-rounded m-5 " 
                  onClick={checkNearestCircle}>
                <i class='fas fa-traffic-light' style={{fontSize:"30px"}}></i>
                  </button>
                </div> */}


  </MapContainer>
        </div>
    )
}

export default NavigatePage
