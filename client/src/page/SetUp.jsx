import React, { useState, useRef, useEffect } from "react";
import SecreteKeyCard from "../assets/components/cards/SecreteKey";
import AdminRegistration from "../assets/components/cards/AdminRegistration";

const SetUp = () => {
    const [secretKey_valid, setSecretKey_valid]= useState(false)
  return (
      <div className="h-screen w-full flex justify-center items-center bg-gradient-to-br from-slate-900 to-blue-900 flex">
     {secretKey_valid ? <AdminRegistration/> : <SecreteKeyCard setSecretKey_valid={setSecretKey_valid}/>}
    </div>
  );
};

export default SetUp;
