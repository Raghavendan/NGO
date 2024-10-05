import { useNavigate } from "react-router-dom"
import Menubar from "../Nav & Foot/menubar";

function Chat(){
    const navigate = useNavigate();
    return(
        <>
        <Menubar />
        <h2>Community Chat</h2>
        </>
        
    );
}
export default Chat;