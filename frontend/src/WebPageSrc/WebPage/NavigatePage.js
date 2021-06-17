import React,{useEffect,useState} from 'react'
import {useSelector} from 'react-redux';
import { Map as MapContainer, 
    TileLayer, 
    Marker, 
    Popup,
  Polyline,CircleMarker  } from 'react-leaflet'

import {waypoints} from '../token/AcessToken'
import {SwapArr} from '../Helper/SwapArr'


const limeOptions = { color: 'red' }

var counter=0
var timeout;
var coordinates=waypoints.routes[0].geometry.coordinates

// const after_change=coordinates.map(coordinate=>{
//     [coordinate[0], coordinate[1]] = [coordinate[1], coordinate[0]];
// })

var coordinates=SwapArr(coordinates)

console.log(coordinates)

function stopTimeout(){
    counter=0
   
}


function NavigatePage(props) {
    
    const [watchPositionID,setWatchPositionID]=useState(null);
    const [currentPosition,setCurrentPosition]=useState([0,0])
    const [zoom,setZoom]=useState(12);

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
                setCurrentPosition(coordinates[counter])
            }
              
               counter=counter+1
               if(counter>coordinates.length){
                stopTimeout()
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
             
            
             <MapContainer center={currentPosition} zoom={zoom} zoomControl={false} scrollWheelZoom={false} style={{height: "800px"}}>
                 <div style={{zIndex:"999",position:"absolute"}}>
                 <button type="button" class="btn btn-danger mr-5" onClick={CancelWatch}>CANCEL WATCH(dev purpose)</button>
             <button type="button" class="btn btn-primary mx-5 mt-5" onClick={() => setZoom(zoom + 1)}><h5>+</h5></button>
             <button type="button" class="btn btn-primary mx-5" onClick={() => setZoom(zoom - 1)}><h5>-</h5></button>
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
  </MapContainer>
        </div>
    )
}

export default NavigatePage
