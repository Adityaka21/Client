
import { Navigate, Route } from 'react-router-dom';
import './App.css';
import { BrowserRouter, Routes } from 'react-router-dom';
import Login from './Login.js';
import Home from './Home.js';
import AppLayout from './layout/AppLayout.js';
import UserLayout from './layout/UserLayout.js';
import Dashboard from './pages/Dashboard.js';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Error from './pages/Error.js';
import Logout from './pages/Logout.js';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { SET_USER } from './redux/user/actions';
import Register from './pages/Register.js';
import Spinner from "./components/Spinner";
import ManageUsers from "./pages/users/ManageUsers.js";
import ProctectedRoute from './rbac/ProctectedRoute.js';
import UnauthorizedAccess from './components/UnauthorizedAccess.js';
import ManagePayments from './payments/PaymentsDash.js';
import AnalyticsDashboard from './pages/links/AnalyticsDashboard.js';
import { serverEndpoint } from './config/config.js';


function App() {
  // const [userDetails,setUserDetails] = useState(null);

  const userDetails = useSelector((state) => state.userDetails);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true)

  
  const attemptToRefreshToken = async () => {
  try {
    const response = await axios.post(
      `${serverEndpoint}/auth/refresh-token`,
      {},
      { withCredentials: true }
    );

    dispatch({
      type: SET_USER,
      payload: response.data.userDetails
    });
  } catch (error) {
    console.log(error);
  }
};

  const isUserLoggedIn = async () => {
    try {
      const response = await axios.post('http://localhost:5000/auth/is-user-logged-in', {}, {
        withCredentials: true
      });
      // updateUserDetails(response.data.userDetails);
      dispatch({
        type: 'SET_USER',
        payload: response.data.userDetails
      });

    } catch (error) {
      if (error.response?.status === 401) {
  console.log('Token expired, attempting to refresh');
  await attemptToRefreshToken();
} else {
  console.log('User not loggedin', error);
}

    } finally {
      setLoading(false)
    }
  };
  useEffect(() => {
    isUserLoggedIn();
  }, []);

  if (loading) {
    return <Spinner />;
  }
  return (
    <Routes>
      <Route path='/' element={userDetails ? <Navigate to='/dashboard' /> : <AppLayout><Home /></AppLayout>} />
      {/* we're passing the updateUserDetails function to the Login component so that it can update the user details in the App component */}
      {/* we'll get user information from the Login component and update it in the App component */}
      <Route path='/login' element={userDetails ?
        <Navigate to='/dashboard' /> :
        <AppLayout><Login /></AppLayout>} />
      <Route path='/dashboard' element={userDetails ? <UserLayout><Dashboard /></UserLayout> : <Navigate to='/login' />} />
      <Route path='/manage-payment' element={userDetails ? <UserLayout><ManagePayments /></UserLayout> : <Navigate to='/login' />} />
      <Route path="/users" element={userDetails ?
        <ProctectedRoute roles={['admin']}>
          (<UserLayout>
            <ManageUsers />
          </UserLayout> )
        </ProctectedRoute> : (<Navigate to="/login" />)} />
      <Route path="/unauthorized-access" element={userDetails ?
        <UserLayout>
          <UnauthorizedAccess />
        </UserLayout> : <Navigate to='/login' />
      } ></Route>
      <Route
        path="/analytics/:linkId"
        element={ userDetails ? (
             <UserLayout>
              <AnalyticsDashboard />
            </UserLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route path='/logout' element={userDetails ? <Logout /> : <Navigate to='/login' />} />
      <Route path='/register' element={userDetails ? <Navigate to='/dashboard' /> :
        <AppLayout><Register /></AppLayout>} />
      <Route path='/error' element={userDetails ? <Error /> :
        <AppLayout><Error /></AppLayout>} />
    </Routes>
  );
}

export default App;
