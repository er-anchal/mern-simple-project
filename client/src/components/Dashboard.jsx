import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:5000/api';

export default function Dashboard() {
  const navigate   = useNavigate();
  const loggedUser = localStorage.getItem('email');

  const [users, setUsers] = useState([]);
  const [editId, setEditId]  = useState(null);
  const [editForm,   setEditForm]   = useState({ email: '', password: '' });
  const [imgFiles,   setImgFiles]   = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [msg, setMsg]  = useState('');
  const [addForm, setAddForm] = useState({ email: '', password: '' });

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

  // ── Delete ───────────────────────────────────────────────────────────────────
  const deleteUser = async id => {
    if (!window.confirm('Delete this user?')) return;
    await fetch(`${API}/users/${id}`, { method: 'DELETE' });
    fetchUsers();
  };

  // ── Edit ─────────────────────────────────────────────────────────────────────
  const startEdit = user => {
    setEditId(user._id);
    setEditForm({ email: user.email, password: user.password });
  };

  const saveEdit = async () => {
    await fetch(`${API}/users/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    setEditId(null);
    fetchUsers();
  };

// ── Add New User
  const handleAddUser = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('email', addForm.email);
    data.append('password', addForm.password);

    try {
      const res = await fetch(`${API}/register`, { method: 'POST', body: data });
      const body = await res.json();
      
      if (!res.ok) throw new Error(body.error || 'Failed to add user');
      
      setAddForm({ email: '', password: '' });
      fetchUsers();
      setMsg('New user added successfully!');
    } catch (err) {
      alert(err.message);
    }
  };


  // ── Post-login image upload ───────────────────────────────────────────────────
  const handleUpload = async e => {
    e.preventDefault();
    if (!imgFiles.length) return setMsg('Select at least 1 image.');
    const data = new FormData();
    Array.from(imgFiles).forEach(f => data.append('images', f));
    const res  = await fetch(`${API}/upload`, { method: 'POST', body: data });
    const body = await res.json();
    setUploadedUrls(body.urls || []);
    setMsg(`${body.urls.length} image(s) uploaded successfully!`);
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

{/* ── Add New User Form ── */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-success text-white">Add New User</div>
        <div className="card-body">
          <form onSubmit={handleAddUser} className="row g-3 align-items-center">
            <div className="col-auto">
              <input type="email" className="form-control" placeholder="Email ID"
                value={addForm.email} 
                onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div className="col-auto">
              <input type="password" className="form-control" placeholder="Password"
                value={addForm.password} 
                onChange={e => setAddForm(f => ({ ...f, password: e.target.value }))} required />
            </div>
            <div className="col-auto">
              <button type="submit" className="btn btn-success">Create User</button>
            </div>
          </form>
        </div>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u._id}>
                  <td>{i + 1}</td>

                  {/* Inline edit or display */}
                  {editId === u._id ? (
                    <>
                      <td>
                        <input className="form-control form-control-sm"
                          value={editForm.email}
                          onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} />
                      </td>
                      <td>
                        <input className="form-control form-control-sm"
                          value={editForm.password}
                          onChange={e => setEditForm(f => ({ ...f, password: e.target.value }))} />
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{u.email}</td>
                      <td><code>{u.password}</code></td>
                    </>
                  )}

                  <td>{u.gender}</td>
                  <td>{u.city}</td>
                  <td>{(u.qualifications || []).join(', ')}</td>
                  <td>
                    {editId === u._id ? (
                      <>
                        <button className="btn btn-success btn-sm me-1" onClick={saveEdit}>Save</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setEditId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-warning btn-sm me-1" onClick={() => startEdit(u)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteUser(u._id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {!users.length && (
                <tr><td colSpan="7" className="text-center text-muted py-3">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Post-login Image Upload ── */}
      <div className="card shadow-sm" style={{ maxWidth: 520 }}>
        <div className="card-header bg-secondary text-white">Upload Images (1–4)</div>
<div className="card-body">
          {msg && <div className="alert alert-info py-2">{msg}</div>}
          <form onSubmit={handleUpload}>
            <div className="mb-3">
              <label className="form-label">Select Images (max 4)</label>
              <input type="file" className="form-control" accept="image/*" multiple
                onChange={e => {
                  setMsg('');
                  setImgFiles(Array.from(e.target.files).slice(0, 5));
                }} />
              <small className="text-muted">You can select up to 4 images at once.</small>
            </div>
            <button type="submit" className="btn btn-secondary">Upload to Cloudinary</button>
          </form>
           {/* can preview the uploaded images immediately after upload without refreshing */}
          {uploadedUrls.length > 0 && (
            <div className="mt-3">
              <p className="fw-semibold">Uploaded:</p>
              <div className="d-flex flex-wrap gap-2">
                {uploadedUrls.map((url, i) => (
                  <img key={i} src={url} alt={`uploaded-${i}`}
                    style={{ width: 100, height: 100, objectFit: 'cover' }}
                    className="rounded border" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
