import Login from "./pages/Login";
import { AdminContext } from "./context/AdminContext";
import { useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const { aToken } = useContext(AdminContext);

  return aToken ? (
    <ToastContainer />
  ) : (
    <div>
      <Login />
      <ToastContainer />
    </div>
  );
};

export default App;
