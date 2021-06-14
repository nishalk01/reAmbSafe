import React,{useEffect} from 'react'
// import { Link } from 'react-router-dom'
import {useDispatch} from 'react-redux';
import {AddUserLocation} from '../redux';

function EmergencyNavBar() {
    const dispatch =useDispatch();

    useEffect(()=>{
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition((position)=>{
                dispatch(AddUserLocation([position.coords.latitude,position.coords.longitude]))
            });  
        }
        else{
            alert("Your browser doesnot support geolocation")
        }

    },[])
    return (
        <div class="pb-5">
           <nav class="navbar fixed-top navbar-light bg-danger ">
  <div class="container-fluid">
    <a class="navbar-brand" href="#"><h4>AmbSafe</h4></a>
    {/* <div class="d-flex  w-auto">
     
        <a href="/"><i class="fas fa-user" style={{fontSize:25,cursor:"pointer"}} ></i></a>
    </div> */}
  </div>
</nav> 
        </div>
    )
}

export default EmergencyNavBar
