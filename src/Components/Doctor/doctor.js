import React, { useState } from "react";
import DoctorPopup from "./popup";
import { useAuth } from "../Context/context";
import axios from "axios";
import "./doctor.css";

function Doctor() {
  const { doctors, setDoctors } = useAuth();
  const [show, setShow] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const handleAddDoctor = (newDoctor) => {
    setDoctors(prev => [...prev, newDoctor]);
  };

  // Toggle availability status
  const toggleAvailability = async (doctorId, currentStatus) => {
    setUpdatingId(doctorId);
    try {
      const response = await axios.patch(`/api/doctors/${doctorId}`, {
        available: !currentStatus
      });

      if (response.data) {
        // Update local state
        setDoctors(prev => 
          prev.map(doctor => 
            doctor._id === doctorId 
              ? { ...doctor, available: !currentStatus }
              : doctor
          )
        );
      }
    } catch (error) {
      console.error("Error updating availability:", error);
      alert("Failed to update availability");
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete doctor
  const deleteDoctor = async (doctorId) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) {
      return;
    }

    setUpdatingId(doctorId);
    try {
      const response = await axios.delete(`/api/doctors/${doctorId}`);

      if (response.data) {
        // Remove from local state
        setDoctors(prev => prev.filter(doctor => doctor._id !== doctorId));
      }
    } catch (error) {
      console.error("Error deleting doctor:", error);
      alert("Failed to delete doctor");
    } finally {
      setUpdatingId(null);
    }
  };

  // Get availability badge
  const getAvailabilityBadge = (available) => {
    return available 
      ? { class: 'available', text: 'Available', icon: '✅' }
      : { class: 'unavailable', text: 'Unavailable', icon: '❌' };
  };

  return (
    <div className="doctor-container">
      {show && (
        <DoctorPopup
          isOpen={show}
          onClose={() => setShow(false)}
          onSuccess={handleAddDoctor}
        />
      )}

      <div className="data-section">
        <div className="section-header">
          <h2>Doctors List</h2>
          <button className="add-btn" onClick={() => setShow(true)}>
            + Add New Doctor
          </button>
        </div>

        {/* Stats Cards */}
        <div className="doctor-stats">
          <div className="stat-card">
            <div className="stat-icon total">👨‍⚕️</div>
            <div className="stat-details">
              <h3>{doctors.length}</h3>
              <p>Total Doctors</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon available">✅</div>
            <div className="stat-details">
              <h3>{doctors.filter(d => d.available).length}</h3>
              <p>Available</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon unavailable">❌</div>
            <div className="stat-details">
              <h3>{doctors.filter(d => !d.available).length}</h3>
              <p>Unavailable</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon avg-rating">⭐</div>
            <div className="stat-details">
              <h3>{(doctors.reduce((sum, d) => sum + (d.rating || 0), 0) / (doctors.length || 1)).toFixed(1)}</h3>
              <p>Avg Rating</p>
            </div>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Doctor</th>
                <th>Specialty</th>
                <th>Experience</th>
                <th>Patients</th>
                <th>Rating</th>
                <th>Fee</th>
                <th>Availability</th>
                <th>Languages</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => {
                const availability = getAvailabilityBadge(doctor.available);
                const isUpdating = updatingId === doctor._id;

                return (
                  <tr key={doctor._id} className={isUpdating ? 'updating' : ''}>
                    <td>#{doctor._id?.slice(-6) || 'N/A'}</td>
                    
                    <td className="doctor-info-cell">
                      <div className="doctor-avatar">
                        {doctor.image ? (
                          <img src={doctor.image} alt={doctor.name} />
                        ) : (
                          <div className="avatar-placeholder">👨‍⚕️</div>
                        )}
                      </div>
                      <div className="doctor-details">
                        <div className="doctor-name">{doctor.name}</div>
                        <div className="doctor-education">{doctor.education}</div>
                      </div>
                    </td>
                    
                    <td>{doctor.specialty}</td>
                    
                    <td>{doctor.experience || 'N/A'}</td>
                    
                    <td>{doctor.patients?.toLocaleString() || 0}</td>
                    
                    <td>
                      <span className="rating">
                        ⭐ {doctor.rating?.toFixed(1) || '0.0'}
                      </span>
                    </td>
                    
                    <td>
                      <span className="fee">{doctor.fee || 'N/A'}</span>
                    </td>
                    
                    <td>
                      <button
                        className={`availability-btn ${availability.class}`}
                        onClick={() => toggleAvailability(doctor._id, doctor.available)}
                        disabled={isUpdating}
                        title="Click to toggle availability"
                      >
                        <span>{availability.icon}</span>
                        <span>{availability.text}</span>
                      </button>
                      {doctor.nextAvailable && (
                        <div className="next-available">
                          Next: {doctor.nextAvailable}
                        </div>
                      )}
                    </td>
                    
                    <td>
                      <div className="languages">
                        {doctor.languages?.slice(0, 2).map((lang, i) => (
                          <span key={i} className="language-tag">{lang}</span>
                        ))}
                        {doctor.languages?.length > 2 && (
                          <span className="more-languages">+{doctor.languages.length - 2}</span>
                        )}
                      </div>
                    </td>
                    
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn delete"
                          onClick={() => deleteDoctor(doctor._id)}
                          disabled={isUpdating}
                          title="Delete doctor"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {doctors.length === 0 && (
                <tr>
                  <td colSpan="10" className="no-data">
                    No doctors found. Click "Add New Doctor" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Additional Info Section */}
        {doctors.length > 0 && (
          <div className="doctor-footer">
            <p>Click on availability button to toggle between Available/Unavailable</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Doctor;