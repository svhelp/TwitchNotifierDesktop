import { logOut } from "components/logic/slice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export const useLogOut = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const onLogOut = () => {
        window.electron.store.removeAccessToken();
        dispatch(logOut());
        navigate("/auth");
    }

    return onLogOut;
}