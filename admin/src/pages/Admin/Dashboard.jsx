import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { useEffect } from "react";
import { assets } from "../../assets/assets";
const Dashboard = () => {
  const { aToken, dashData, getAdminDashboard, cancelAppointment } = useContext(AdminContext);
  useEffect(() => {
    if (aToken) {
      getAdminDashboard();
    }
  }, [aToken]);

  return (
    dashData && (
      <div className="m-5">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 hover:scale-105 transition-all">
            <img className="w-14" src={assets.doctor_icon} alt="doctor icon" />
            <div>
              <p className="text-xl font-semibold text-gray-600">{dashData.doctors}</p>
              <p className="text-gray-400">Doctors</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 hover:scale-105 transition-all">
            <img className="w-14" src={assets.appointments_icon} alt="doctor icon" />
            <div>
              <p className="text-xl font-semibold text-gray-600">{dashData.appointments}</p>
              <p className="text-gray-400">Appointments</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 hover:scale-105 transition-all">
            <img className="w-14" src={assets.patients_icon} alt="doctor icon" />
            <div>
              <p className="text-xl font-semibold text-gray-600">{dashData.patients}</p>
              <p className="text-gray-400">Users</p>
            </div>
          </div>
        </div>

        <div className="bg-white">
          <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border">
            <img src={assets.list_icon} alt="" />
            <p className="font-semibold">Latest Bookings</p>
          </div>

          <div className="pt-4 border border-t-0">
            {dashData.latestAppointment?.map((item, index) => (
              <div className="flex items-center px-6 py-3 gap-3 hover: bg-gray-100 " key={index}>
                <img className="w-10 rounded-full" src={item.docData.image} alt="" />
                <div className="flex-1 text-sm">
                  <p className="text-gray-800 font-medium">{item.docData.name}</p>
                  <p className="text-gray-800 font-medium">{item.slotDate}</p>
                </div>
                {item.payment && <p className="text-green-500">Paid</p>}
                {item.cancelled && <p className="text-red-500">Cancelled</p>}
                {!item.cancelled && !item.payment && (
                  <img
                    className="w-10 hover:scale-125"
                    onClick={() => {
                      cancelAppointment(item._id);
                    }}
                    src={assets.cancel_icon}
                    title="Cancel Appointment"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;
