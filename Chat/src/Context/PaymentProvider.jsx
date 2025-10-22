// Chat/src/Context/PaymentProvider.jsx

import React, { useState, createContext } from "react"; // <-- 1. Add createContext
// import { PaymentContext } from "./maincontext.jsx"; // <-- 2. DELETE THIS LINE

// 3. ADD THIS LINE to create and export the context
export const PaymentContext = createContext(null);

export const PaymentProvider = ({ children }) => {
  const [paymentData, setPaymentData] = useState({
    planName: "ProPlus", 
  });

  return (
    <PaymentContext.Provider value={{ paymentData, setPaymentData }}>
      {children}
    </PaymentContext.Provider>
  );
};