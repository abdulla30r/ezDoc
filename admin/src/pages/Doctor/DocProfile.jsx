import { useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { useContext } from "react";
const DocProfile = () => {
  const { dToken, getDoctorData, docData } = useContext(DoctorContext);

  useEffect(() => {
    getDoctorData();
  }, [dToken]);

  return <div>{console.log(docData)}</div>;
};

export default DocProfile;
