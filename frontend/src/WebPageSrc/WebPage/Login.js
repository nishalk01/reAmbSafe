import axios from 'axios';
import React, { useState } from 'react'
import { Redirect } from "react-router-dom";


import '../assets/Login.css'
import logo from '../assets/logo192.png'
// import {GoogleLogin} from 'react-google-login'
import {ValidatePhoneNumber} from '../Helper/Validate'
import {baseUrl} from '../Helper/baseurl'


// TODO assignn role which will be defined in the server db
export default function Login() {
  const [phone,setPhone]=useState(null);
  const [username,setUsername]=useState(null);
  const [phoneErr,setPhoneErr]=useState(false);
  const [hash,setHash]=useState(null);
  const [otp,setOtp]=useState(null);


  // show alert 
  const [Alert,showAlert]=useState(false);
  const [errMssg,setErrorMessage]=useState(null);

  // sent otp sucess message
  const [sucessMssg,setSucessMssg]=useState(null);

  // redirect url
  // const [redirect,setRedirect]=useState(null);
    

  // for setting value on changes
   const handleChange=(e)=>{
     if(e.target.id==="phone"){
      setPhone(e.target.value)
     }
     else if(e.target.id==="username"){
       setUsername(e.target.value)
     }
     else if(e.target.id==="otp"){
       setOtp(e.target.value)
     }
   }

   const handleSubmit=(e)=>{
     e.preventDefault()
    //  make a api request to server to ask it to send otp

     console.log("phone is "+phone +" and username is "+username)
     
   }

   const checkForValidity=(e)=>{
       if(e.target.id==="phone"){
        //  check to see if number is valid
        
        setPhoneErr(!ValidatePhoneNumber(e.target.value))

       }
   }
  
  const sendOTP=()=>{
    if(!phoneErr){
      axios.post(baseUrl+"auth/verify-phoneNo",{
        phoneNumber:phone
      })
      .then(res=>{
        console.log(res.data)
        setHash(res.data.hash)
        const message=`An otp is sent to the number ${phone}`
          setSucessMssg(message);
      })
      .catch(err=>{
        console.log(err)
      })
    }
   else{
     alert("please enter phone number first")
   }
   
  }

  const verifyOTP=(e)=>{
    e.preventDefault()
    if(phone && otp && hash){

      axios.post(baseUrl+"auth/verify-otp",{
        phoneNumber:phone,
        otp:otp,
        hash:hash
      })
      .then(res=>{

          showAlert(false)
          console.log(res.data)
          localStorage.setItem("password",res.data.password);
          localStorage.setItem("phoneNumber",res.data.phoneNumber);
          localStorage.setItem("id",res.data._id)
          localStorage.setItem("role",res.data.role)
          window.location.href="http://localhost:3000/home"
        //  setRedirect("/home")

        
      })
      .catch(err=>{
        console.log(err)
        if(err.response){
          if(err.response.status===500||err.response.status===401){
            setErrorMessage(err.response.data.message)
             showAlert(true);
           }
           else if(err.response.status==403){
            //  forbidden user
            setErrorMessage("This user is not registered in database");
            showAlert(true)
           }

        }
     
        console.log(err);

      })
    }
   
  }

    return ( 
    <div className="container mt-5 ">
     
      <div className="row justify-content-center " >
        <div class="col-lg-6 col-md-10  rounded bg-gradient-4  shadow p-5 text-center mb-5 gradientApply"  style={{ color:"white" }}>
         
         <img width="90" height="100" src={logo} alt="logo"/>

         <form className="pt-5" onSubmit={verifyOTP}>
           
           <h5 className="pb-5">Please Enter your number to verify</h5>
          
    <div class="mb-4">
      <div class="input-group mb-3">
  <input type="text" class="form-control  py-4" onChange={handleChange} onBlur={checkForValidity} id="phone" placeholder="Phone number" aria-label="Phone number"
    aria-describedby="button-addon2" />
  <button  class="btn btn-primary btn-rounded" type="button" onClick={sendOTP} id="button-addon2" data-mdb-ripple-color="dark"  >
    Send OTP
  </button>
  
  
 
</div>
{sucessMssg?(<div class="alert alert-success" role="alert">
  {sucessMssg}
</div>):null}
{phoneErr?(<h6 className="mt-3">
        Please enter a valid Phone number
      </h6>):null} 

     {hash?(<input type="text" onChange={handleChange} maxlength="6" onBlur={checkForValidity} class="form-control rounded py-4" id="otp" aria-describedby="emailHelp"  placeholder="Enter OTP" />):null} 
      
  </div>

  {/* <div class="mb-3">
    <input type="text" onChange={handleChange} class="form-control rounded py-2" id="username" aria-describedby="emailHelp" placeholder="Enter a username"/>
  </div>
   */}

   

   {errMssg?( <div class="alert alert-danger" role="alert">
  {errMssg}
</div>):null}
   
  <button type="submit" class="btn btn-success btn-rounded  btn-lg mt-4 px-5" onClick={verifyOTP}>Verify</button>
         </form>
             

             {/* {redirect?(<Redirect to={redirect} />):null} */}



     </div>
     

      </div>
        
    </div>
     


    )
}
