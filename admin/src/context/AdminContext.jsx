/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect } from "react";
import { createContext } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

// eslint-disable-next-line react-refresh/only-export-components
export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [aToken, setAToken] = useState(localStorage.getItem("aToken") ? localStorage.getItem("aToken") : "");
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const verifyAdmin = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/verify-admin", { headers: { aToken } });
      if (data.success) {
        toast.success(data.message);
      } else {
        localStorage.removeItem("aToken");
        setAToken("");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    verifyAdmin();
  }, [aToken]);

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/all-doctors", { headers: { aToken } });
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(backendUrl + "/api/admin/change-availability", { docId }, { headers: { aToken } });
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/all-appointments", { headers: { aToken } });
      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to cancel this appointment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      try {
        const { data } = await axios.post(backendUrl + "/api/admin/cancel-appointment", { appointmentId }, { headers: { aToken } });
        if (data.success) {
          toast.success(data.message);
          getAllAppointments();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error);
      }
    } else {
      toast.info("Not Cancelled.");
    }
  };

  const value = { aToken, setAToken, backendUrl, getAllDoctors, doctors, changeAvailability, appointments, getAllAppointments, cancelAppointment };
  // eslint-disable-next-line react/prop-types
  return <AdminContext.Provider value={value}>{props.children}</AdminContext.Provider>;
};
export default AdminContextProvider;
