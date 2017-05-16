import React from 'react';
import {BrowserRouter as Router,Route,NavLink} from 'react-router-dom'



const Links = () => (
  <nav>
    <NavLink exact activeClassName="active" to="/">Login</NavLink>
    <NavLink strict activeClassName="active" to={{pathname: '/about'}}>About</NavLink>
    <NavLink strict activeClassName="active" to={{pathname: '/Home'}}>Home</NavLink>
    <NavLink strict activeClassName="active" to={{pathname: '/video'}}>Video</NavLink>
    <NavLink strict activeClassName="active" to={{pathname: '/settings'}}>Settings</NavLink>
  </nav>
)

export default Links
