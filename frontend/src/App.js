import React,{useEffect,useState} from 'react';
import {BrowserRouter, Switch, Route,Redirect} from 'react-router-dom';

import Login from './WebPageSrc/WebPage/Login'
import HomePage from './WebPageSrc/WebPage/HomePage'

function App() {
  
  const [loggedIn,setLoggedIn]=useState(null);

  useEffect(() => {
    if(localStorage.getItem("password")){
      // console.log(localStorage.getItem("auth_token"))
      setLoggedIn(true)
    }
  }, [])

  return (
    <BrowserRouter>
      <Switch>
      <Route exact path="/"  component={Login}/>
      <Route exact path="/home"  component={HomePage}/>
      </Switch>
      {/* {loggedIn?(<Redirect to="/home"/>):(<Redirect to="/"/>)} */}
    </BrowserRouter>
    
  );
}

export default App;
