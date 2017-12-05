import React from 'react';
import {NavLink} from 'react-router-dom';

const NavBar = ()=>(
  <div>
    <div>
    <NavLink exact to="/">A</NavLink>
    <NavLink activeClassName='hah'  to="/b">B</NavLink>
    <NavLink to="/c/111">C</NavLink>
    <NavLink to="/redirect">redirect</NavLink>
    </div>
  </div>
)



export default NavBar ;
