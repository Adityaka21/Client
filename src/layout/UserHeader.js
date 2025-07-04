import React from "react";
import { Link } from 'react-router-dom';
import Can from '../rbac/Can'

function UserHeader() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Dashboard</Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <span
                className="nav-link dropdown-toggle"
                id="adminDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ cursor: 'pointer' }}
              >
                Admin
              </span>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="adminDropdown">
                  <Can permission = 'canViewUser'>
                <li>

                  <Link className="dropdown-item" to="/users">
                    Manage Users
                  </Link>
                </li>
                  </Can>
                <li>
                  <Link className="dropdown-item" to="/logout">
                    Logout
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to = "/manage-payment" >Payments
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default UserHeader;
