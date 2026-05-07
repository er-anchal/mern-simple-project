import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:5000/api';

export default function Dashboard() {
  const navigate   = useNavigate();
  const loggedUser = localStorage.getItem('email');

  const [users, setUsers] = useState([]);

  // ── Fetch all users ──────────────────────────────────────────────────────────
  const fetchUsers = async () => {
    const res = await fetch(`${API}/users`);
    setUsers(await res.json());
  };

  useEffect(() => { fetchUsers(); }, []);

  // ── Logout ───────────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="container-fluid mt-3">
      {/* ── Navbar ── */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">
          <span className="text-primary">Dashboard</span>
          <small className="fs-6 text-muted ms-2">Logged in as: {loggedUser}</small>
        </h3>
        <button className="btn btn-outline-danger btn-sm" onClick={logout}>Logout</button>
      </div>

      {/* ── Users Table ── */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-primary text-white">Registered Users</div>
        <div className="card-body p-0">
          <table className="table table-bordered table-hover table-striped mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Password</th>
                <th>Gender</th>
                <th>City</th>
                <th>Qualifications</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u._id}>
                  <td>{i + 1}</td>
                  <td>{u.email}</td>
                  <td><code>{u.password}</code></td>
                  <td>{u.gender}</td>
                  <td>{u.city}</td>
                  <td>{(u.qualifications || []).join(', ')}</td>
                </tr>
              ))}
              {!users.length && (
                <tr><td colSpan="6" className="text-center text-muted py-3">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
