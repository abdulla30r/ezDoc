/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "$";
  const backendurl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") ? localStorage.getItem("token") : "");
  const [userData, setUserData] = useState(false);

  const getDoctorData = async () => {
    try {
      const { data } = await axios.get(backendurl + "/api/doctor/list");
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const loadUserProfile = async () => {
    try {
      const { data } = await axios.get(backendurl + "/api/user/get-profile", { headers: { token } });
      if (data.success) {
        setUserData(data.userData);
      } else {
        setUserData(false);
        localStorage.removeItem("token");
        setToken("");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const value = { doctors, currencySymbol, token, setToken, backendurl, userData, setUserData, loadUserProfile, getDoctorData };

  useEffect(() => {
    getDoctorData();
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    loadUserProfile();
  }, [token]);
  // eslint-disable-next-line react/prop-types
  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};
export default AppContextProvider;
