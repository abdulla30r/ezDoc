import { useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { useEffect } from "react";
import { assets } from "../../assets/assets";

const DocAppointment = () => {
  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext);
  const { calculateAge, currency } = useContext(AppContext);

  useEffect(() => {
    getAppointments();
  }, [dToken]);
  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>
      <div className="bg-white border rounded text-sm max-h-[80vh] min-h- [60vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_1fr_1.5fr] grid-flow-col py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {appointments.map((item, index) => (
          <div
            className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_1fr_1.5fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-100"
            key={index}
          >
            <p className=" max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2">
              <img className="w-8 rounded-full" src={item.userData.image} alt="" />
              <p>{item.userData.name}</p>
            </div>
            <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
            <p>
              {item.slotDate}, {item.slotTime}
            </p>

            <p>
              {currency} {item.docData.fees}
            </p>
            {item.cancelled && <p className="text-red-500">Cancelled</p>}
            {item.isCompleted && <p className="text-green-500">Completed</p>}

            {!item.cancelled && !item.isCompleted && (
              <div className="flex flex-row gap-3">
                <img
                  onClick={() => completeAppointment(item._id)}
                  className="w-10 hover:scale-125"
                  src={assets.tick_icon}
                  title="Complete Appointment"
                />
                {!item.payment && (
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    className="w-10 hover:scale-125"
                    src={assets.cancel_icon}
                    title="Cancel Appointment"
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocAppointment;
