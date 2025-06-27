import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleOAuthProvider , GoogleLogin } from '@react-oauth/google';
import { serverEndpoint } from './config';
import { useDispatch } from 'react-redux';

function Login({ updateUserDetails}) {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formdata,setformdata] = useState({
    username: '',
    password: ''
  })
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
   
    setformdata({
      ...formdata,
      [name]: value
    })
  }
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
     const validate= () => {
      let newErrors = {};
      let isValid = true;
      if(formdata.username.length === 0) {
        newErrors.username = 'Username is required';
        isValid = false;
      }
      if(formdata.password.length === 0) {
        newErrors.password = 'Password is required';
        isValid = false;
      }

      setErrors(newErrors);
      return isValid;
     }
     
     const handleGoogleSignin = async (authResponse) => {
        try {
          const response = await axios.post('http://localhost:5000/auth/google-auth', {idToken: authResponse.credential},{
            withCredentials: true
          });

          dispatch({
            type: 'SET_USER', 
            payload: response.data.userDetails
          });
        }
     catch(error) {
      console.log(error);
      setErrors({message: 'Something went wrong, please try again later.'});
     }
    }

    const handleGoogleFailure = async (error) => {
      console.log(error);
      setErrors({message: 'Something went wrong, please try again later.'});
    }

    const handleSubmit = async (event) => {
      event.preventDefault();
      if (validate()) {
        const body = {
          username: formdata.username,
          password: formdata.password
        };

        const configuration = {
          withCredentials: true
        };
        try{
        const response = await axios.post(`${serverEndpoint}/auth/login`, body, configuration);
        dispatch({
          type: 'SET_USER', 
          payload: response.data.userDetails
        });
        }
        catch(error) {
          if(error?.response?.status === 401){
            setErrors({message: 'Invalid credentials'})
          }
          else{
          setErrors({message: 'Something went wrong, please try again later.'});
          }
        }
      }
    }

  return (
    <div className='container mt-5'>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow">
            <h1 className="text-center mb-4">Sign in to Continue</h1>

            {message && (
              <div className="alert alert-success">{message}</div>
            )}
            {errors.message && (
              <div className="alert alert-danger">{errors.message}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input type='text' name='username' value={formdata.username}
                onChange={handleChange}
                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                />
                {errors.username && (<div className='invalid-feedback'>{errors.username}</div>)}
              </div>

              <div className='mb-3'>
                <label className="form-label">Password</label>
                <input type='password' name='password' value={formdata.password}
                onChange={handleChange}
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                />
                {errors.password && (<div className='invalid-feedback'>{errors.password}</div>)}
              </div>

              <div className='d-grid'>
                <button type='submit' className='btn btn-primary'>Login</button>
              </div>
            </form>

            <h4 className="text-center mt-4">OR</h4>
            <div className="d-flex justify-content-center mt-2">
              <GoogleOAuthProvider clientId = {process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                <GoogleLogin onSuccess={handleGoogleSignin} onError={handleGoogleFailure} />
              </GoogleOAuthProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
