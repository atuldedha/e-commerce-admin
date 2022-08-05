import React from 'react';
import {Navigate, Outlet} from 'react-router-dom'

const Authenticated = ({user, notAuthenticated}) => {
    if(notAuthenticated){
      return user ? <Navigate to = "/"/> : <Outlet />
    }else{
      return user ? <Outlet /> : <Navigate to = "/login" />
    }
};

export default Authenticated;
