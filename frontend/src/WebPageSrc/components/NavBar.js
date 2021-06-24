import React,{useEffect,useState} from 'react';
import socketIOClient from "socket.io-client";

// for dispatching a notification action
import {useDispatch} from 'react-redux';
import {AddNewNotification,AddSocketConnection,AddUserLocation} from '../redux'

import { axiosInstance, baseUrl } from '../Helper/baseurl';
import useUnload from '../Helper/Unload';


function NavBar() {
  const [navSocketObj,setNavSocketObj]=useState(null);

  const [role,setRole]=useState(localStorage.getItem("role"))

  const dispatch=useDispatch();
 

  // set socket client
  useUnload(e => {
    e.preventDefault();
    e.returnValue = '';
    navSocketObj.emit("set_available",{
      password:localStorage.getItem("password"),
      phoneNumber:localStorage.getItem("phoneNumber")
    })
  });

    useEffect(()=>{
      // when client disconnects
      
      const socket=socketIOClient(baseUrl, {
        query:{
          password:localStorage.getItem("password"),
          id:localStorage.getItem("id")
        }
        

      });
      dispatch(AddSocketConnection(socket))
      // also setUp userLocation
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position)=>{
            dispatch(AddUserLocation([position.coords.latitude,position.coords.longitude]))
        });  
    }
    else{
        alert("Your browser doesnot support geolocation")
    }
      
      setNavSocketObj(socket);
       // for ambulance 
      if(role==="Ambulance"){
        socket.on("new_notification",(notification)=>{
          console.log(notification);
          dispatch(AddNewNotification(notification))
        })
      }
      else if(role==="Hospital"){
        console.log("hello")
        socket.on("HospitalNotification",(formdata)=>{
          console.log(formdata)
          dispatch(AddNewNotification(formdata))
        })
      }
     
     


      window.addEventListener('beforeunload', function (e) {
        e.preventDefault();
        socket.emit("set_available",{
          password:localStorage.getItem("password"),
          phoneNumber:localStorage.getItem("phoneNumber")
        })
    })
      return ()=>{
        window.removeEventListener('beforeunload', function (e) {
          e.preventDefault();
          socket.emit("set_available",{
            password:localStorage.getItem("password"),
            phoneNumber:localStorage.getItem("phoneNumber")
          })
      })
       
        socket.disconnect();
      }

     
    },[])

    const logoutUser=()=>{
      // clear storage
      // redirect to login
      // set available to false 

      
      axiosInstance.get(baseUrl+"auth/logout").then(res=>{
        if(res.status===200){
          localStorage.clear();
          window.location.href="http://localhost:3000/" 

        }
      })
      .catch(err=>{
        console.log(err)
      })
    }
    return (
        <div className="mb-5">
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
  <div className="container-fluid">
    <button
      className="navbar-toggler"
      type="button"
      data-mdb-toggle="collapse"
      data-mdb-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <i className="fas fa-bars"></i>
    </button>

    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <a className="navbar-brand mt-2 mt-lg-0" href="#">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1280px-React-icon.svg.png"
          height="25"
          alt=""
          loading="lazy"
        />
      </a>
      {/* <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <a className="nav-link" href="#"></a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Team</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Profile</a>
        </li>
      </ul> */}
    </div>
   

    <div className="d-flex align-items-center">
     
      <a
        className="text-reset me-3 dropdown-toggle hidden-arrow"
        href="#"
        role="button"
      >
        <i className="fas fa-bell" style={{fontSize:"28px" }}></i>
        <span className="badge rounded-pill badge-notification bg-danger">new</span>
      </a>
      <a
        className="dropdown-toggle d-flex align-items-center hidden-arrow"
        href="#"
        id="navbarDropdownMenuLink"
        role="button"
        data-mdb-toggle="dropdown"
        aria-expanded="false"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1280px-React-icon.svg.png"
          className="rounded-circle"
          height="25"
          alt=""
          loading="lazy"
        />
      </a>
      <ul
        className="dropdown-menu dropdown-menu-end"
        aria-labelledby="navbarDropdownMenuLink"
      >
        <li>
          <a className="dropdown-item" href="#">My profile</a>
        </li>
        <li>
          <a className="dropdown-item" href="#">Settings</a>
        </li>
        <li>
          <a className="dropdown-item" onClick={logoutUser}>Logout</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
        </div>
    )
}

export default NavBar
