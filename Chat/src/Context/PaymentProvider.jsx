import React, { useState } from "react";
import { PaymentContext } from "./maincontext.jsx";

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