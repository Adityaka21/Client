import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container mt-5 text-center">
      <div className="card shadow p-4">
        <h1 className="mb-4">Welcome to Home</h1>
        <Link to="/" className="btn btn-primary m-2">
          Home
        </Link>
        <Link to="/login" className="btn btn-success m-2">
          Login
        </Link>
      </div>
    </div>
  );
}

export default Home;
