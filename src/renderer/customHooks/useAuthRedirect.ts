import { isAuthenticated } from "renderer/logic/slice";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const useAuthRedirect = () => {
  const navigate = useNavigate();

  const isAuth = useSelector(isAuthenticated);
  
  useEffect(() => {
    if (isAuth) {
      navigate("/index");
    } else {
      navigate("/");
    }
  }, [ isAuth, navigate ]);
}