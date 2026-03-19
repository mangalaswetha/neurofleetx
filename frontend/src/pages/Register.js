import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'CUSTOMER' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/auth/register', form);
      navigate('/login');
    } catch {
      setError('Registration failed. Email may already exist.');
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h1 style={s.logo}>⚡ NeuroFleetX</h1>
        <p style={s.sub}>Create your account</p>
        <form onSubmit={handleRegister} style={s.form}>
          <input style={s.input} placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name:e.target.value})} required />
          <input style={s.input} type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} required />
          <input style={s.input} type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password:e.target.value})} required />
          <select style={s.input} value={form.role} onChange={e => setForm({...form, role:e.target.value})}>
            <option value="CUSTOMER">Customer</option>
            <option value="DRIVER">Driver</option>
            <option value="FLEET_MANAGER">Fleet Manager</option>
            <option value="ADMIN">Admin</option>
          </select>
          {error && <p style={{color:'#ef4444'}}>{error}</p>}
          <button style={s.btn} type="submit">REGISTER →</button>
        </form>
        <p style={{color:'#94a3b8',textAlign:'center',marginTop:'1rem'}}>
          Have account? <Link to="/login" style={{color:'#00d4ff'}}>Login</Link>
        </p>
      </div>
    </div>
  );
}

const s = {
  page:  { minHeight:'100vh', background:'#0a0e1a', display:'flex', alignItems:'center', justifyContent:'center' },
  card:  { background:'rgba(17,24,39,0.9)', border:'1px solid rgba(0,212,255,0.2)', borderRadius:'16px', padding:'2.5rem', width:'100%', maxWidth:'420px' },
  logo:  { color:'#00d4ff', fontFamily:'sans-serif', fontSize:'2rem', marginBottom:'0.5rem' },
  sub:   { color:'#94a3b8', marginBottom:'2rem', fontSize:'0.9rem' },
  form:  { display:'flex', flexDirection:'column', gap:'1rem' },
  input: { background:'rgba(255,255,255,0.05)', border:'1px solid rgba(0,212,255,0.2)', borderRadius:'8px', padding:'0.75rem', color:'#e2e8f0', fontSize:'1rem' },
  btn:   { background:'linear-gradient(135deg,#00d4ff,#0088ff)', color:'#000', border:'none', padding:'0.875rem', borderRadius:'8px', fontWeight:'700', cursor:'pointer', fontSize:'1rem' },
};