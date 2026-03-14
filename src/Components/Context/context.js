
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [Appointment,setAppointment]=useState([])
    const [doctors,setDoctors]=useState([])
        const [users,setusers]=useState([])


const getAppointments = async () => {
  const res = await axios.get("http://localhost:5000/api/appointments");
  setAppointment(res.data.appointments)
  console.log(res)
  return res.data.appointments;
};

const getDoctors = async () => {
  const res = await axios.get("http://localhost:5000/api/get/doctors");
  setDoctors(res.data)
  console.log("doctors",res.data)
  return res;
};

const getUsers = async () => {
  const res = await axios.get("http://localhost:5000/api/users/get/");
  setusers(res.data.users)
  console.log("users",res.data.users)
  return res;
};

  useEffect(()=>{
    getAppointments()
    getDoctors()
    getUsers()
  },[])


  const value = {
    Appointment,
    doctors,
    users
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
