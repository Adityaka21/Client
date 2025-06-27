import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: 'linear-gradient(to right,rgb(22, 14, 31),rgb(68, 74, 86))',
      }}
    >
      <div className="card shadow-lg p-5 text-center" style={{ maxWidth: '500px', borderRadius: '1rem' }}>
        <h1 className="mb-3 text-primary fw-bold">Welcome to Home</h1>
        <p className="text-muted mb-4">Experience a sleek, simple React + Bootstrap UI.</p>

        <div className="d-grid gap-3">
          <Link to="/" className="btn btn-outline-primary btn-lg">
            Home
          </Link>
          <Link to="/login" className="btn btn-primary btn-lg">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
