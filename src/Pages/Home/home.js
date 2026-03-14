import React, { useState } from 'react';
import Doctor from '../../Components/Doctor/doctor';
import User from '../../Components/Users/user';
import Appointments from '../../Components/Appointments/Appointment';
import './home.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('doctors');
  
  // Sample data
  const doctors = [
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Cardiology', patients: 145, rating: 4.8, status: 'active' },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Neurology', patients: 120, rating: 4.9, status: 'active' },
    { id: 3, name: 'Dr. Emily Williams', specialty: 'Pediatrics', patients: 200, rating: 4.7, status: 'active' },
    { id: 4, name: 'Dr. James Brown', specialty: 'Orthopedics', patients: 98, rating: 4.5, status: 'inactive' },
    { id: 5, name: 'Dr. Lisa Anderson', specialty: 'Dermatology', patients: 167, rating: 4.8, status: 'active' },
  ];

  const users = [
    { id: 1, name: 'John Smith', email: 'john@email.com', appointments: 3, joinDate: '2024-01-15', status: 'active' },
    { id: 2, name: 'Emma Watson', email: 'emma@email.com', appointments: 5, joinDate: '2024-02-20', status: 'active' },
    { id: 3, name: 'Robert Miller', email: 'robert@email.com', appointments: 1, joinDate: '2024-03-10', status: 'inactive' },
    { id: 4, name: 'Sophie Turner', email: 'sophie@email.com', appointments: 8, joinDate: '2024-01-05', status: 'active' },
    { id: 5, name: 'David Wilson', email: 'david@email.com', appointments: 2, joinDate: '2024-02-28', status: 'active' },
    { id: 6, name: 'Maria Garcia', email: 'maria@email.com', appointments: 4, joinDate: '2024-03-01', status: 'active' },
  ];

  return (
    <div className="admin-panel">
      {/* Left Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <h2>MediAdmin</h2>
        </div>
        
        <div className="nav-items">
          <div 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="icon">📊</span>
            <span>Dashboard</span>
          </div>
          
          <div 
            className={`nav-item ${activeTab === 'doctors' ? 'active' : ''}`}
            onClick={() => setActiveTab('doctors')}
          >
            <span className="icon">👨‍⚕️</span>
            <span>Doctors</span>
            <span className="badge">{doctors.length}</span>
          </div>
          
          <div 
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            
            <span className="icon">👤</span>
            <span>Users</span>
            <span className="badge">{users.length}</span>
          </div>
          
          <div className="nav-item" onClick={() => setActiveTab('appointment')}>
            <span className="icon">📅</span>
            <span>Appointments</span>
          </div>
          
          <div className="nav-item">
            <span className="icon">⚙️</span>
            <span>Settings</span>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="admin-profile">
            <div className="avatar">👤</div>
            <div className="admin-info">
              <p className="admin-name">Admin User</p>
              <p className="admin-email">admin@medi.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="content-area">
        <div className="content-header">
          <h1>Welcome back, Admin!</h1>
          <p>Here's what's happening with your platform today</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">👨‍⚕️</div>
            <div className="stat-info">
              <h3>{doctors.length}</h3>
              <p>Total Doctors</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👤</div>
            <div className="stat-info">
              <h3>{users.length}</h3>
              <p>Total Users</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <h3>156</h3>
              <p>Appointments</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>$45.2K</h3>
              <p>Revenue</p>
            </div>
          </div>
        </div>

        {/* Doctors Section */}
        {activeTab === 'doctors' && (<Doctor/>)}

        {/* Users Section */}
        {activeTab === 'users' && (<User/>)}
        {activeTab === 'appointment'&& (<Appointments/>)}
      </div>
    </div>
  );
};

export default AdminPanel;