import { useGetUsersQuery } from "renderer/api/twitchApi";
import { isAuthenticated } from "renderer/logic/slice";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const useUserData = () => {
    const navigate = useNavigate();
  
    const isAuth = useSelector(isAuthenticated);
    const { data, isLoading, error } = useGetUsersQuery({}, { skip: !isAuth });
    
    useEffect(() => {
        if (!!error){
            navigate("/error");
        }
    }, [ navigate, error ])

    return { data, isLoading };
}