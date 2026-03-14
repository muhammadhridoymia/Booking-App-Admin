import React, { useState } from 'react';
import { useAuth } from '../Context/context';
import axios from "axios";
import './Appointment.css';

const Appointments = () => {
    const { Appointment } = useAuth();
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPayment, setFilterPayment] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    // Ensure appointments is an array
    const appointments = Appointment || [];

    // Filter appointments based on search and filters
    const filteredAppointments = appointments.filter(appointment => {
        const matchesSearch = 
            (appointment.doctorName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (appointment.emergencyContact?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        
        const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
        const matchesPayment = filterPayment === 'all' || appointment.paymentStatus === filterPayment;
        
        return matchesSearch && matchesStatus && matchesPayment;
    });

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Format time
    const formatTime = (timeString) => {
        return timeString || 'N/A';
    };

    // Handle status update
    const handleStatusUpdate = async (bookingId, status) => {
        setUpdatingId(bookingId);
        try {
            const response = await axios.put(`http://localhost:5000/api/booking/status/${bookingId}`,{ status });
             if(response.succuss){
                //refress
             }
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setUpdatingId(null);
        }
    };

    // Handle payment status update
    const handlePaymentUpdate = async (bookingId, status) => {
        setUpdatingId(bookingId);
        try {
             const response = await axios.put(`http://localhost:5000/api/booking/status/${bookingId}`,{ status });
             if(response.succuss){
                //refress
             }
        } catch (error) {
            console.error('Error updating payment:', error);
        } finally {
            setUpdatingId(null);
        }
    };

    // Get status badge info
    const getStatusInfo = (status) => {
        switch(status) {
            case 'pending':
                return { class: 'status-pending', text: 'Pending', icon: '⏳' };
            case 'accepted':
                return { class: 'status-accepted', text: 'Accepted', icon: '✅' };
            case 'completed':
                return { class: 'status-completed', text: 'Completed', icon: '🎉' };
            case 'cancelled':
                return { class: 'status-cancelled', text: 'Cancelled', icon: '❌' };
            case 'rejected':
                return { class: 'status-rejected', text: 'Rejected', icon: '🚫' };
            case 'rescheduled':
                return { class: 'status-rescheduled', text: 'Rescheduled', icon: '🔄' };
            case 'no-show':
                return { class: 'status-noshow', text: 'No Show', icon: '👤❌' };
            case 'in-progress':
                return { class: 'status-progress', text: 'In Progress', icon: '⚡' };
            default:
                return { class: 'status-pending', text: 'Pending', icon: '⏳' };
        }
    };

    // Get payment status info
    const getPaymentInfo = (status) => {
        switch(status) {
            case 'paid':
                return { class: 'payment-paid', text: 'Paid', icon: '✅' };
            case 'pending':
                return { class: 'payment-pending', text: 'Pending', icon: '⏳' };
            case 'failed':
                return { class: 'payment-failed', text: 'Failed', icon: '❌' };
            case 'refunded':
                return { class: 'payment-refunded', text: 'Refunded', icon: '↩️' };
            default:
                return { class: 'payment-pending', text: 'Pending', icon: '⏳' };
        }
    };

    return (
        <div className="appointments-container">
            {/* Header */}
            <div className="appointments-header">
                <h2>Appointment Management</h2>
                <div className="header-stats">
                    <span>Total: {appointments.length}</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon blue">📅</div>
                    <div className="stat-details">
                        <h3>{appointments.length}</h3>
                        <p>Total Appointments</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon green">💰</div>
                    <div className="stat-details">
                        <h3>${appointments.reduce((sum, a) => sum + (a.fee || 0), 0)}</h3>
                        <p>Total Revenue</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon orange">⏳</div>
                    <div className="stat-details">
                        <h3>{appointments.filter(a => a.status === 'pending').length}</h3>
                        <p>Pending</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon purple">✅</div>
                    <div className="stat-details">
                        <h3>{appointments.filter(a => a.paymentStatus === 'paid').length}</h3>
                        <p>Paid</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-section">
                <input
                    type="text"
                    placeholder="Search by doctor or patient..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                
                <select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="filter-select"
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="rejected">Rejected</option>
                    <option value="in-progress">In Progress</option>
                    <option value="no-show">No Show</option>
                </select>

                <select 
                    value={filterPayment} 
                    onChange={(e) => setFilterPayment(e.target.value)}
                    className="filter-select"
                >
                    <option value="all">All Payments</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                </select>
            </div>

            {/* Appointments List */}
            <div className="appointments-list">
                {filteredAppointments.length === 0 ? (
                    <div className="no-data">No appointments found</div>
                ) : (
                    filteredAppointments.map((appointment) => {
                        const statusInfo = getStatusInfo(appointment.status);
                        const paymentInfo = getPaymentInfo(appointment.paymentStatus);
                        const isUpdating = updatingId === appointment._id;

                        return (
                            <div key={appointment._id} className="appointment-card">
                                {/* Header with IDs */}
                                <div className="card-header">
                                    <div className="id-section">
                                        <span className="id-label">Appointment ID:</span>
                                        <span className="id-value">{appointment._id?.slice(-8) || 'N/A'}</span>
                                    </div>
                                    <div className="id-section">
                                        <span className="id-label">User ID:</span>
                                        <span className="id-value">{appointment.userId?.slice(-8) || 'N/A'}</span>
                                    </div>
                                </div>

                                {/* Main Content */}
                                <div className="card-content">
                                    {/* Left Column - Doctor & Patient */}
                                    <div className="info-column">
                                        <div className="info-group">
                                            <div className="info-label">👨‍⚕️ Doctor</div>
                                            <div className="info-value doctor-name">{appointment.doctorName}</div>
                                            <div className="info-sub">ID: {appointment.doctorId}</div>
                                        </div>

                                        <div className="info-group">
                                            <div className="info-label">👤 Patient</div>
                                            <div className="info-value">{appointment.emergencyContact}</div>
                                            <div className="info-sub">{appointment.emergencyPhone}</div>
                                        </div>
                                    </div>

                                    {/* Middle Column - Appointment Details */}
                                    <div className="info-column">
                                        <div className="info-group">
                                            <div className="info-label">📅 Date & Time</div>
                                            <div className="info-value">{formatDate(appointment.date)}</div>
                                            <div className="info-sub">{formatTime(appointment.time)}</div>
                                        </div>

                                        <div className="info-group">
                                            <div className="info-label">🏥 Type</div>
                                            <div className="info-value type-badge">
                                                {appointment.appointmentType === 'inperson' ? '🏥 In-person' : '📹 Video'}
                                            </div>
                                        </div>

                                        <div className="info-group">
                                            <div className="info-label">📝 Reason</div>
                                            <div className="info-value reason">{appointment.reason}</div>
                                            {appointment.symptoms && appointment.symptoms !== 'many' && (
                                                <div className="info-sub">Symptoms: {appointment.symptoms}</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Column - Status & Payment */}
                                    <div className="info-column status-column">
                                        <div className="status-group">
                                            <div className="status-label">Appointment Status</div>
                                            <div className={`current-status ${statusInfo.class}`}>
                                                {statusInfo.icon} {statusInfo.text}
                                            </div>
                                            
                                            {/* Status Update Buttons */}
                                            <div className="update-buttons">
                                                <button 
                                                    className="btn-status accept"
                                                    onClick={() => handleStatusUpdate(appointment._id, 'accepted')}
                                                    disabled={isUpdating || appointment.status === 'accepted'}
                                                >
                                                    ✅ Accept
                                                </button>
                                                <button 
                                                    className="btn-status complete"
                                                    onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                                                    disabled={isUpdating || appointment.status === 'completed'}
                                                >
                                                    🎉 Complete
                                                </button>
                                                <button 
                                                    className="btn-status progress"
                                                    onClick={() => handleStatusUpdate(appointment._id, 'in-progress')}
                                                    disabled={isUpdating || appointment.status === 'in-progress'}
                                                >
                                                    ⚡ In Progress
                                                </button>
                                                <button 
                                                    className="btn-status cancel"
                                                    onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                                                    disabled={isUpdating || appointment.status === 'cancelled'}
                                                >
                                                    ❌ Cancel
                                                </button>
                                                <button 
                                                    className="btn-status noshow"
                                                    onClick={() => handleStatusUpdate(appointment._id, 'no-show')}
                                                    disabled={isUpdating || appointment.status === 'no-show'}
                                                >
                                                    👤❌ No Show
                                                </button>
                                            </div>
                                        </div>

                                        <div className="status-group">
                                            <div className="status-label">Payment Status</div>
                                            <div className={`current-status ${paymentInfo.class}`}>
                                                {paymentInfo.icon} {paymentInfo.text}
                                            </div>
                                            
                                            {/* Payment Update Buttons */}
                                            <div className="update-buttons small">
                                                <button 
                                                    className="btn-payment paid"
                                                    onClick={() => handlePaymentUpdate(appointment._id, 'paid')}
                                                    disabled={isUpdating || appointment.paymentStatus === 'paid'}
                                                >
                                                    ✅ Paid
                                                </button>
                                                <button 
                                                    className="btn-payment pending"
                                                    onClick={() => handlePaymentUpdate(appointment._id, 'pending')}
                                                    disabled={isUpdating || appointment.paymentStatus === 'pending'}
                                                >
                                                    ⏳ Pending
                                                </button>
                                                <button 
                                                    className="btn-payment failed"
                                                    onClick={() => handlePaymentUpdate(appointment._id, 'failed')}
                                                    disabled={isUpdating || appointment.paymentStatus === 'failed'}
                                                >
                                                    ❌ Failed
                                                </button>
                                                <button 
                                                    className="btn-payment refunded"
                                                    onClick={() => handlePaymentUpdate(appointment._id, 'refunded')}
                                                    disabled={isUpdating || appointment.paymentStatus === 'refunded'}
                                                >
                                                    ↩️ Refunded
                                                </button>
                                            </div>

                                            <div className="fee-display">
                                                <span className="fee-label">Fee:</span>
                                                <span className="fee-amount">${appointment.fee || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Insurance Info (if exists) */}
                                {appointment.insuranceProvider && appointment.insuranceProvider !== 'no' && (
                                    <div className="insurance-info">
                                        <span className="insurance-label">Insurance:</span>
                                        <span className="insurance-provider">{appointment.insuranceProvider}</span>
                                        <span className="insurance-id">{appointment.insuranceId}</span>
                                    </div>
                                )}

                                {/* First Visit Badge */}
                                {appointment.isFirstVisit && (
                                    <div className="first-visit-badge">First Visit</div>
                                )}

                                {/* Timestamps */}
                                <div className="timestamps">
                                    <span>Created: {new Date(appointment.createdAt?.$date || appointment.createdAt).toLocaleString()}</span>
                                    <span>Updated: {new Date(appointment.updatedAt?.$date || appointment.updatedAt).toLocaleString()}</span>
                                </div>

                                {/* Loading Overlay */}
                                {isUpdating && (
                                    <div className="updating-overlay">
                                        <span>Updating...</span>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Appointments;