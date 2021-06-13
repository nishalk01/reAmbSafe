import React,{useEffect,useState} from 'react';
import {BrowserRouter, Switch, Route,Redirect} from 'react-router-dom';
import {Provider} from 'react-redux';


// for authorized users only
import Login from './WebPageSrc/WebPage/Login'
import HomePage from './WebPageSrc/WebPage/HomePage'


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
import { baseUrl } from './WebPageSrc/Helper/baseurl';


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
    {loggedIn?(!showAppbar?(<NavBar/>):null):(<EmergencyNavBar/>)} 
      <Switch>
      <Route exact path="/"  component={Login}/>
      <Route exact path="/home"  component={HomePage}/>
      <Route exact path="/emergency"  component={Emergency}/>
      <Route exact path="/ambulance/:AmbId" component={AmbPage}/>

      </Switch>
      {/* {loggedIn?(<Redirect to="/home"/>):(<Redirect to="/"/>)} */}
    </BrowserRouter>
    </Provider>
    
  );
}

export default App;