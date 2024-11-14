import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export const DoctorContext = createContext();
const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [dToken, setDToken] = useState(localStorage.getItem("dToken") ? localStorage.getItem("dToken") : "");
  const [docData, setDocData] = useState({});
  const [appointments, setAppointments] = useState([]);

  const verifyDoctor = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/verify-doctor`, {
        headers: { dToken },
      });

      if (data.success) {
        return true;
      } else {
        setDToken("");
        localStorage.removeItem("dToken");
        return false;
      }
    } catch (error) {
      setDToken("");
      localStorage.removeItem("dToken");
      console.log(error.message);
    }
  };

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/doctor-appointments`, { headers: { dToken } });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getDoctorData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/doctor-profile`, { headers: { dToken } });
      setDocData(data.doctor);
    } catch (error) {
      toast.error(error.message);
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
        const { data } = await axios.post(`${backendUrl}/api/doctor/cancel-appointment`, { appointmentId, dToken });
        if (data.success) {
          getAppointments();
          toast.success(data.message);
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

  const completeAppointment = async (appointmentId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Is this completed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, complete it!",
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      try {
        const { data } = await axios.post(`${backendUrl}/api/doctor/complete-appointment`, { appointmentId, dToken });
        if (data.success) {
          getAppointments();
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error);
      }
    } else {
      toast.info("Not Completed.");
    }
  };

  useEffect(() => {
    verifyDoctor();
  }, [dToken]);

  const value = { dToken, setDToken, backendUrl, getAppointments, getDoctorData, docData, appointments, cancelAppointment, completeAppointment };

  // eslint-disable-next-line react/prop-types
  return <DoctorContext.Provider value={value}>{props.children}</DoctorContext.Provider>;
};
export default DoctorContextProvider;
