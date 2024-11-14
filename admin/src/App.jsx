import Login from "./pages/Login";
import { AdminContext } from "./context/AdminContext";
import { useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import AllAppointments from "./pages/Admin/AllAppointments";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorList from "./pages/Admin/DoctorList";
import { DoctorContext } from "./context/DoctorContext";
import DocDash from "./pages/Doctor/DocDash";
import DocProfile from "./pages/Doctor/DocProfile";
import DocAppointment from "./pages/Doctor/DocAppointment";

const App = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  if (aToken) {
    return (
      <div className="bg-[#f8f9fd]">
        <ToastContainer />
        <Navbar />
        <div className="flex items-start">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/all-appointments" element={<AllAppointments />} />
            <Route path="/add-doctor" element={<AddDoctor />} />
            <Route path="/doctor-list" element={<DoctorList />} />
          </Routes>
        </div>
      </div>
    );
  }

  if (dToken) {
    return (
      <div className="bg-[#f8f9fd]">
        <ToastContainer />
        <Navbar />
        <div className="flex items-start">
          <Sidebar />
          <Routes>
            <Route path="/" element={<DocDash />} />
            <Route path="/doc-profile" element={<DocProfile />} />
            <Route path="/doc-appointment" element={<DocAppointment />} />
          </Routes>
        </div>
      </div>
    );
  }
  return (
    <div>
      <Login />
      <ToastContainer />
    </div>
  );
};

export default App;
