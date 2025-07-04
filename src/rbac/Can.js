import { useSelector } from "react-redux";
import { ROLE_PERMISSION } from "./permission";


function Can({permission,children}) {
    const user = useSelector((state)=>state.userDetails);
    const permissions = ROLE_PERMISSION[user?.role] || {};
    return permissions[permission]?children : null;
}
export default Can;
