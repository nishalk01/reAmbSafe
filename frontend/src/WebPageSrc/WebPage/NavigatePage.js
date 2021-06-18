import React,{useEffect,useState} from 'react'
import {useSelector} from 'react-redux';
import { Map as MapContainer, 
    TileLayer, 
    Marker, 
    Popup,
  Polyline,CircleMarker  } from 'react-leaflet'

import {waypoints} from '../token/AcessToken'
import {SwapArr} from '../Helper/SwapArr'
import { getDistance } from '../Helper/Validate';
import '../assets/pulse.css'

const limeOptions = { color: 'red' }

var counter=0
var timeout;
var coordinates=waypoints.routes[0].geometry.coordinates

// const after_change=coordinates.map(coordinate=>{
//     [coordinate[0], coordinate[1]] = [coordinate[1], coordinate[0]];
// })

var coordinates=SwapArr(coordinates)
// is loading from heap memory thats y is not getting swapped
console.log(coordinates)

function stopTimeout(){
    counter=0
   
}


function NavigatePage(props) {
    
    const [watchPositionID,setWatchPositionID]=useState(null);
    const [currentPosition,setCurrentPosition]=useState([0,0])
    const [zoom,setZoom]=useState(20);
    const [disabled,setdisabled]=useState(true);

    const socketObj=useSelector(state=>state.SocketConnectionReducer.socketObj);



    useEffect(() => {

        timeout=setInterval(()=>{
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
            },1000)

            return () => {
              clearInterval(timeout)
             
             }
    }, [])

    const CancelWatch=()=>{
        clearInterval(timeout)
        stopTimeout()
        navigator.geolocation.clearWatch(watchPositionID);

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
        <input type="text" class="form-control  py-2 "  id="phone" autoComplete={false} placeholder="Patient_Name(optional)" aria-label="Phone number"
    aria-describedby="button-addon2" />
     <input type="text" class="form-control  py-2 "  id="phone" autoComplete={false} placeholder="Patient L.Name(optional)" aria-label="Phone number"
    aria-describedby="button-addon2" />
        </div>
 
<div>
<select class="form-select mt-3" >
  <option  selected disabled={true} >Select Severity</option>
  <option  value="1">Low</option>
  <option value="2">Medium</option>
  <option value="3">Critical</option>
  <option value="4">Severe</option>
</select>

</div>

<div>
<select className="form-select mt-3">
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

<div>
<textarea className="form-control mt-4" aria-label="With textarea" placeholder="Fill in patient Description"></textarea>
</div>

  
  </div>

  
  </form>
  
  
 


      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-mdb-dismiss="modal">
          SEND
        </button>
      </div>
    </div>
  </div>
</div>
            
             <MapContainer center={currentPosition} zoom={zoom} zoomControl={false} scrollWheelZoom={false} style={{height: "800px"}}>
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
  </MapContainer>
        </div>
    )
}

export default NavigatePage
