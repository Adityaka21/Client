import { Link } from "react-router-dom";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

function AppLayout({ children}) {
    return (
        <>
       
        <UserHeader />
        {children}
        <UserFooter />
        
        </>
    )
}

export default AppLayout