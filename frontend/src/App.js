import React,{useEffect,useState} from 'react';
import {BrowserRouter, Switch, Route,Redirect} from 'react-router-dom';
import {Provider} from 'react-redux';


// for authorized users only
import Login from './WebPageSrc/WebPage/Login'
import HomePage from './WebPageSrc/WebPage/HomePage'
import NavigatePage from './WebPageSrc/WebPage/NavigatePage'
import HospitalClient from './WebPageSrc/WebPage/HospitalClient'
import HospitalGetLocation from './WebPageSrc/WebPage/HospitalGetLocation'



// emergency page(for anonymous users)
import Emergency from './WebPageSrc/WebPage/Emergency'
import AmbPage from './WebPageSrc/WebPage/Emergency2';

// components
import EmergencyNavBar from './WebPageSrc/components/EmergencyNavBar';
import NavBar from './WebPageSrc/components/NavBar';

/* refrence for programatic redirect in 
      ./WebPageSrc/WebPage/Login and 
      ./WebPageSrc/WebPage/Emergency
      src:https://dev.to/projectescape/programmatic-navigation-in-react-3p1l
*/
// redux store
import store from './WebPageSrc/redux/store';


function App() {
  
  const [loggedIn,setLoggedIn]=useState(null);
  const [showAppbar,setShowAppbar]=useState(false)

  

  useEffect(() => {
    if(localStorage.getItem("password")){
      // console.log(localStorage.getItem("auth_token"))
      setLoggedIn(true)
      setShowAppbar(String(window.location.href)=="http://localhost:3000/")
    }
  }, [])

  return (
    <Provider store={store}>

   
    <BrowserRouter>
    {/* TODO only allow user with particular role to acess these pages */}
    {loggedIn?(!showAppbar?(<NavBar/>):null):(<EmergencyNavBar/>)} 
      <Switch>
      <Route exact path="/"  component={Login}/>
      <Route exact path="/home"  component={HomePage}/>
      <Route exact path="/emergency"  component={Emergency}/>
      <Route exact path="/ambulance/:AmbId" component={AmbPage}/>
      <Route exact path="/navigate/:SocketId" component={NavigatePage}/>
      <Route exact path="/hospital" component={HospitalClient}/>
      <Route exact path="/view-location/:fromId" component={HospitalGetLocation}/>

      </Switch>
      {/* {loggedIn?(<Redirect to="/home"/>):(<Redirect to="/"/>)} */}
    </BrowserRouter>
    </Provider>
    
  );
}

export default App;
