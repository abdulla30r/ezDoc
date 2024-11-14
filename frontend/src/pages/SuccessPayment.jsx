import { useEffect, useContext, CSSProperties } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BounceLoader from "react-spinners/BounceLoader";

const SuccessPayment = () => {
  const { backendurl, token } = useContext(AppContext);
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const sessionId = queryParams.get("session_id"); // Get the 'session_id' query parameter
  console.log(sessionId);

  const verifyPayment = async (sessionId) => {
    try {
      const { data } = await axios.post(backendurl + "/api/user/verify-payment", { sessionId }, { headers: { token } });

      // Wait for 1 second before showing the toast and navigating
      await new Promise((resolve) => setTimeout(resolve, 500)); 

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message || "Payment failed or session not found.");
      }

      // Navigate after the delay and toast
      navigate("/my-appointments");
    } catch (err) {
      // Wait for 1 second before showing error toast and navigating
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast.error(err.message || "Payment failed or session not found.");
      navigate("/my-appointments");
    }
  };

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID found.");
      return;
    }

    // Call the verifyPayment function
    verifyPayment(sessionId);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen text-center">
      <BounceLoader size={100} color="#3498db" />
      <p className="text-2xl mt-4">Verifying Payment</p>
    </div>
  );
};

export default SuccessPayment;
