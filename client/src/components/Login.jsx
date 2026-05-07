import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API = 'http://localhost:5000/api';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm]   = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res  = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Login failed');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-sm" style={{ width: 380 }}>
        <div className="card-header bg-success text-white">
          <h4 className="mb-0">Login</h4>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email ID</label>
              <input type="email" className="form-control" name="email"
                value={form.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" name="password"
                value={form.password} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-success w-100">Login</button>
          </form>
          <p className="mt-3 text-center">
            New user? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
