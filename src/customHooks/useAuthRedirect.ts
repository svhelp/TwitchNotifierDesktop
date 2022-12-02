import { isAuthenticated } from "components/logic/slice";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const useAuthRedirect = () => {
  const navigate = useNavigate();

  const isAuth = useSelector(isAuthenticated);
  
  useEffect(() => {
    if (isAuth) {
      navigate("/");
    } else {
      navigate("/auth");
    }
  }, [ isAuth, navigate ]);
}