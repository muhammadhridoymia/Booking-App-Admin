import React, { useState } from 'react';
import axios from 'axios';
import './popup.css';

const DoctorPopup = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        specialty: '',
        experience: '',
        patients: '',
        rating: '',
        education: '',
        languages: '',
        availability: '',
        available: true,
        fee: '',
        nextAvailable: ''
    });
    
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const formDataToSend = new FormData();
            
            // Append all form fields
            Object.keys(formData).forEach(key => {
                if (key === 'languages') {
                    // Convert comma-separated string to array
                    formDataToSend.append(key, JSON.stringify(formData[key].split(',').map(lang => lang.trim())));
                } else if (key === 'patients' || key === 'rating') {
                    formDataToSend.append(key, Number(formData[key]));
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Append image if selected
            if (imageFile) {
                formDataToSend.append('image', imageFile);
            }

            // Send to backend
            const response = await axios.post('http://localhost:5000/api/doctors', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.success) {
                onSuccess(response.data);
                onClose();
                // Reset form
                setFormData({
                    name: '',
                    specialty: '',
                    experience: '',
                    patients: '',
                    rating: '',
                    education: '',
                    languages: '',
                    availability: '',
                    available: true,
                    fee: '',
                    nextAvailable: ''
                });
                setImageFile(null);
                setImagePreview('');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating doctor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-container">
                <div className="popup-header">
                    <h2>Add New Doctor</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="popup-form">
                    {/* Image Upload */}
                    <div className="form-group image-upload">
                        <label>Doctor Photo</label>
                        <div className="image-preview-container">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="image-preview" />
                            ) : (
                                <div className="image-placeholder">📷</div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="image-input"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Full Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                placeholder="Dr. Sarah Johnson"
                            />
                        </div>

                        <div className="form-group">
                            <label>Specialty *</label>
                            <input
                                type="text"
                                name="specialty"
                                value={formData.specialty}
                                onChange={handleInputChange}
                                required
                                placeholder="Cardiology"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Experience</label>
                            <input
                                type="text"
                                name="experience"
                                value={formData.experience}
                                onChange={handleInputChange}
                                placeholder="15 years"
                            />
                        </div>

                        <div className="form-group">
                            <label>Total Patients</label>
                            <input
                                type="number"
                                name="patients"
                                value={formData.patients}
                                onChange={handleInputChange}
                                placeholder="3200"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Rating (0-5)</label>
                            <input
                                type="number"
                                name="rating"
                                value={formData.rating}
                                onChange={handleInputChange}
                                step="0.1"
                                min="0"
                                max="5"
                                placeholder="4.9"
                            />
                        </div>

                        <div className="form-group">
                            <label>Consultation Fee</label>
                            <input
                                type="text"
                                name="fee"
                                value={formData.fee}
                                onChange={handleInputChange}
                                placeholder="$120"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Education</label>
                        <input
                            type="text"
                            name="education"
                            value={formData.education}
                            onChange={handleInputChange}
                            placeholder="Harvard Medical School"
                        />
                    </div>

                    <div className="form-group">
                        <label>Languages (comma separated)</label>
                        <input
                            type="text"
                            name="languages"
                            value={formData.languages}
                            onChange={handleInputChange}
                            placeholder="English, Spanish, French"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Availability</label>
                            <input
                                type="text"
                                name="availability"
                                value={formData.availability}
                                onChange={handleInputChange}
                                placeholder="Mon-Fri"
                            />
                        </div>

                        <div className="form-group">
                            <label>Next Available</label>
                            <input
                                type="text"
                                name="nextAvailable"
                                value={formData.nextAvailable}
                                onChange={handleInputChange}
                                placeholder="Today"
                            />
                        </div>
                    </div>

                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                name="available"
                                checked={formData.available}
                                onChange={handleInputChange}
                            />
                            Available for appointments
                        </label>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="popup-footer">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Creating...' : 'Add Doctor'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DoctorPopup;