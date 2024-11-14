import { createContext } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currency = "$";
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDay = new Date(dob);
    let age = today.getFullYear() - birthDay.getFullYear();
    return age;
  };
  const value = {
    calculateAge,
    currency,
  };

  // eslint-disable-next-line react/prop-types
  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};
export default AppContextProvider;
