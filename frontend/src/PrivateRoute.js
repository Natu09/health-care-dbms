import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "./Auth";

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const { currentUser } = useContext(AuthContext);
  return (
    <div>
      <Route
        {...rest}
        render={routeProps =>
          !!currentUser ? (
            <RouteComponent {...routeProps} />
          ) : (
            <Redirect to={"/login"} />
          )
        }
      />
    </div>
  );
};

export default PrivateRoute;
