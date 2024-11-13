import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "$";
  const backendrul = import.meta.env.VITE_BACKEND_URL;
  const [doctors, setDoctors] = useState([]);
  const value = {
    doctors,
    currencySymbol,
  };

  const getDoctorData = async () => {
    try {
      const { data } = await axios.get(backendrul + "/api/doctor/list");
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getDoctorData();
  }, [doctors]);

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};
export default AppContextProvider;
