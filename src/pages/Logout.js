import axios from 'axios';
import { useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
function Logout({updateUserDetails}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/auth/logout', {}, { withCredentials: true });
           dispatch({
                type: 'CLEAR_USER'   
              
            });
        } catch (error) {
            console.log(error);
            navigate('/');
        }
    };

    useEffect(() => {
        handleLogout();
    }, []);

}

export default Logout;  