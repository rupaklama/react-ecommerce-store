import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";

const RequireAuth = () => {
  const { user } = useAppSelector(state => state.account);

  // to redirect back to the initial route
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // to render children component
  return <Outlet />;
};
export default RequireAuth;
