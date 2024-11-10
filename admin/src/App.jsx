import Login from "./pages/Login";
import { AdminContext } from "./context/AdminContext";
import { useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";

const App = () => {
  const { aToken } = useContext(AdminContext);

  return aToken ? (
    <div className="bg-[#f8f9fd]">
      <ToastContainer />
      <Navbar />
    </div>
  ) : (
    <div>
      <Login />
      <ToastContainer />
    </div>
  );
};

export default App;
