import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "./Auth";

import AdminLayout from "layouts/Admin.jsx";

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const { currentUser } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={routeProps =>
        !!currentUser ? (
                
  
          <AdminLayout {...routeProps} />
          
        
          ) : (
          <Redirect to={"/login"} />
        )
      }
    />
  );
};

export default PrivateRoute;
