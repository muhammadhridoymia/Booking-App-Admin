import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [Appointment, setAppointment] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [users, setusers] = useState([]);

  

  useEffect(() => {
    const API = process.env.REACT_APP_SERVER_URL;
    
    const getAppointments = async () => {
      const res = await axios.get(`${API}/api/appointments`);
      setAppointment(res.data.appointments);
      return res.data.appointments;
    };

    const getDoctors = async () => {
      const res = await axios.get(`${API}/api/get/doctors`);
      setDoctors(res.data);
      return res;
    };

    const getUsers = async () => {
      const res = await axios.get(`${API}/api/users/get`);
      setusers(res.data.users);
      return res;
    };

    getAppointments();
    getDoctors();
    getUsers();
  }, []);

  const value = {
    Appointment,
    doctors,
    users,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
