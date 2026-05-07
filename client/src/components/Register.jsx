import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API = 'http://localhost:5000/api';

const CITIES = ['Mumbai', 'Pune', 'Satara', 'Nashik'];
const QUALS  = ['SSC', 'HSC', 'BSC', 'BCOM', 'MCA', 'PhD'];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '', password: '', confirmPassword: '',
    gender: '', city: '', qualifications: [],
    image1: null, image2: null, image3: null, image4: null,
  });
  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setForm(f => ({ ...f, [name]: files[0] }));
    } else if (type === 'checkbox') {
      setForm(f => ({
        ...f,
        qualifications: checked
          ? [...f.qualifications, value]
          : f.qualifications.filter(q => q !== value),
      }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword)
      return setError('Passwords do not match');

    const data = new FormData();
    data.append('email',    form.email);
    data.append('password', form.password);
    data.append('gender',   form.gender);
    data.append('city',     form.city);
    form.qualifications.forEach(q => data.append('qualifications', q));
    ['image1','image2','image3','image4'].forEach(k => {
      if (form[k]) data.append(k, form[k]);
    });

   try {
      const res  = await fetch(`${API}/register`, { method: 'POST', body: data });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Registration failed');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 600 }}>
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Register</h4>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email ID</label>
              <input type="email" className="form-control" name="email"
                value={form.email} onChange={handleChange} required />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" name="password"
                value={form.password} onChange={handleChange} required />
            </div>

            {/* Confirm Password */}
            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input type="password" className="form-control" name="confirmPassword"
                value={form.confirmPassword} onChange={handleChange} required />
            </div>

            {/* Gender */}
            <div className="mb-3">
              <label className="form-label d-block">Gender</label>
              {['Male','Female','Others'].map(g => (
                <div className="form-check form-check-inline" key={g}>
                  <input className="form-check-input" type="radio"
                    name="gender" value={g} id={g}
                    checked={form.gender === g} onChange={handleChange} required />
                  <label className="form-check-label" htmlFor={g}>{g}</label>
                </div>
              ))}
            </div>

            {/* City */}
            <div className="mb-3">
              <label className="form-label">City</label>
              <select className="form-select" name="city"
                value={form.city} onChange={handleChange} required>
                <option value="">-- Select City --</option>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Qualifications */}
            <div className="mb-3">
              <label className="form-label d-block">Educational Qualification</label>
              {QUALS.map(q => (
                <div className="form-check form-check-inline" key={q}>
                  <input className="form-check-input" type="checkbox"
                    name="qualifications" value={q} id={q}
                    checked={form.qualifications.includes(q)} onChange={handleChange} />
                  <label className="form-check-label" htmlFor={q}>{q}</label>
                </div>
              ))}
            </div>

            {/* 4 Individual Image Uploads */}
            {[1,2,3,4].map(n => (
              <div className="mb-3" key={n}>
                <label className="form-label">Image {n}</label>
                <input type="file" className="form-control"
                  name={`image${n}`} accept="image/*" onChange={handleChange} />
              </div>
            ))}

            <button type="submit" className="btn btn-primary w-100">Register</button>
          </form>
          <p className="mt-3 text-center">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
