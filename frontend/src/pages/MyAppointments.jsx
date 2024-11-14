import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";

const MyAppointments = () => {
  const { backendurl, token, getDoctorData } = useContext(AppContext);
  const [appointmetns, setAppointments] = useState([]);

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendurl + "/api/user/appointments", { headers: { token } });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendurl + "/api/user/cancel-appointment", { appointmentId }, { headers: { token } });
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const paymentStripe = async (appointmentId) => {
    const stripe = await loadStripe("pk_test_51NOo9NBnNH1WMEecGeKIJAa95AG2S9vlqO2fQTmy9on9zhuBaVtQYg3NROLIakBgUMalpIWf5gzHX4LCVozWArco00kIADU4R5");

    const { data } = await axios.post(
      backendurl + "/api/user/payment-stripe",
      { appointmentId },
      { headers: { token, "Content-Type": "application/json" } }
    );

    console.log(data.id);

    stripe.redirectToCheckout({
      sessionId: data.id,
    });
    // try {
    //   const { data } = await axios.post(backendurl + "/api/user/payment-stripe", { appointmentId }, { headers: { token } });
    //   if (data.success) {
    //     toast.success(data.message);
    //   } else {
    //     toast.error(data.message);
    //   }
    // } catch (error) {
    //   toast.error(error.message);
    // }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);
  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My Appointments</p>
      <div>
        {appointmetns.map((item, index) => (
          <div className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b" key={index}>
            <div>
              <img className="w-32 bg-indigo-50" src={item.docData.image} alt="" />
            </div>
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">{item.docData.name} </p>
              <p>{item.docData.speciality} </p>
              <p className="text-zinc-700 font-medium mt-1">Address: </p>
              <p className="text-xs">{item.docData.address.line1} </p>
              <p className="text-xs">{item.docData.address.line2} </p>
              <p className="text-xs mt-1">
                <span className="text-sm text-neutral-700 font-medium">Date & Time : </span> {item.slotDate} | {item.slotTime}
              </p>
            </div>

            {item.isCompleted && (
              <div>
                <div className="flex flex-col gap-2 justify-end">
                  <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-primary hover:text-white transition-all duration-300">
                    Completed
                  </button>
                </div>
              </div>
            )}
            {!item.isCompleted && !item.cancelled && !item.payment && (
              <div>
                <div className="flex flex-col gap-2 justify-end">
                  <button
                    onClick={() => paymentStripe(item._id)}
                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    Pay Online
                  </button>

                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white transition-all duration-300"
                  >
                    Cancel Appointment
                  </button>
                </div>
              </div>
            )}

            {!item.isCompleted && item.payment && (
              <div>
                <button className="text-sm text-blue-500 text-center sm:min-w-48 py-2 border border-blue-500 hover:bg-red-600 hover:text-white transition-all duration-300 cursor-not-allowed">
                  Paid
                </button>
              </div>
            )}
            {item.cancelled && (
              <div>
                <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-primary hover:text-white transition-all duration-300 cursor-not-alloweds">
                  Cancelled
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
