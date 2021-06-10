import React, { useEffect } from 'react'
import NavBar from '../components/NavBar'
import '../assets/Login.css'
import { axiosInstance } from '../Helper/baseurl'

function HomePage() {
    // make a reques to get all notification at beginning
    useEffect(()=>{
        axiosInstance.get("notify/GetNotification")
        .then(res=>{
            console.log(res.status)
        })
        .catch(err=>{
            console.log(err)
        })

    },[])
    return (
        <div>
            <NavBar/>
            <div className="container-fluid">
            <div className="row justify-content-md-center">
                {/* card start emergency*/}
            <div class="card  col-lg-8 col-md-10 mt-4 text-light hover-shadow burningOrange rounded">
            <div class="card-body">
                <h5 class="card-title">Place</h5>
                <p class="card-text">
                 Approximate time and place of emergency 
                </p>
                <button type="button" class="btn btn-primary btn-rounded">Navigate</button>
            </div>
            <div class="card-footer ">2 days ago</div>
            </div>
            {/* card end emergency */}

           {/* card start safe */}
            <div class="card col-lg-8 col-md-10 mt-4 text-dark hover-shadow back2earth rounded">
            <div class="card-body">
                <h5 class="card-title">Place</h5>
                <p class="card-text">
                 Approximate time and place of emergency 
                </p>
                <button type="button" class="btn btn-primary btn-rounded">Navigate</button>
            </div>
            <div class="card-footer ">2 days ago</div>
            </div>
            {/* card end safe */}


            </div>
            </div>
            
    
            
           
            
        </div>
    )
}

export default HomePage
