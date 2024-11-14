import { useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
const DocProfile = () => {
  const { dToken, backendurl, setDocData, getDoctorData, docData } = useContext(DoctorContext);
  const { currency } = useContext(AppContext);

  useEffect(() => {
    getDoctorData();
  }, [dToken]);

  return (
    <div className="ml-10">
      <div>
        <img className="w-72" src={docData.image} alt="" />
      </div>
      <div className="mt-4 text-center">
        <h2 className="text-xl font-semibold text-gray-800">{docData.name}</h2>
        <p className="text-gray-500">{docData.speciality}</p>
        <p className="text-gray-400 text-sm">{docData.degree}</p>

        <p className="text-gray-400 text-sm">{docData.experience} of experience</p>
        <p className="mt-2 text-gray-700">{docData.about}</p>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-medium text-gray-800">Address</h3>
        <p className="text-gray-600">{docData.address?.line1}</p>
        <p className="text-gray-600">{docData.address?.line2}</p>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <p className="text-lg font-medium text-gray-800">
          Fees:{" "}
          <span className="font-semibold">
            {currency} {docData.fees}
          </span>
        </p>
        <p className="text-lg font-medium text-gray-800">
          Available: {docData.available && "yes"} {!docData.available && "no"}
        </p>
      </div>
    </div>
  );
};

export default DocProfile;
