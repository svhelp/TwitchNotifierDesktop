import { logOut } from "renderer/logic/slice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export const useLogOut = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const onLogOut = () => {
        window.electron.ipcRenderer.sendMessage('remove_token', [])
        dispatch(logOut());
        navigate("/");
    }

    return onLogOut;
}