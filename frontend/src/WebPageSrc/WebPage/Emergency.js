import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";


import Card from '../components/Card'
import { baseUrl } from '../Helper/baseurl';

function Emergency() {
    const [ambList,setAmbList]=useState([]);
    // for navigating to secondPage
    let history=useHistory();

    useEffect(()=>{
        axios.get(baseUrl+"notify/allAmbulanceList")
        .then(res=>{
            setAmbList(res.data);
        })
        .catch(err=>{
            console.log(err);
    
        })
    },[])
   
    const sendToEmergency=(_id)=>{

       history.push(`/ambulance/${_id}`)
    }
   
    const DisplayList=ambList.length?(
        ambList.map(amb=>{
            return(
           <Card available={amb.available} heading={amb.phoneNumber} id={amb._id} ClickEvent={sendToEmergency}  buttonText="Send Help Request" content="some info about ambulance"/>
            )
        })
    ):(<h1>Loading</h1>)
    return (
        <div>
        <div className="container-fluid">
            <div className="row justify-content-md-center">
                {DisplayList}
        </div>

        </div>
        </div>
    )
}

export default Emergency
