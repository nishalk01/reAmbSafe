import React,{useEffect,useState} from 'react';
import {useSelector} from 'react-redux';
import { Map as MapContainer, TileLayer, Marker, Popup  } from 'react-leaflet'



export default function HospitalGetLocation(props) {
    const socketObj=useSelector(state=>state.SocketConnectionReducer.socketObj);
    const [position,setPosition]=useState([0,0])

    useEffect(() => {
        socketObj.on("locationToHospital",(data)=>{
            console.log(data)
            setPosition(data.location)
        })
    }, [])
    return (
        <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{height: "100vh",width:"100%"}}>
    <TileLayer
      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={position}>
      <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </Marker>
  </MapContainer>
    )
}
