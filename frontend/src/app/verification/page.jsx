"use client";
import React, { useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { toast, Toaster } from 'react-hot-toast';

const Verification = () => {
  const [otp, setOtp] = useState({
    otp_1: '',
    otp_2: '',
    otp_3: '',
    otp_4: '',
  });

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const handleInputChange = (e, index) => {
    const value = e.target.value;

    setOtp((prevOtp) => {
      const newOtp = { ...prevOtp, [`otp_${index + 1}`]: value };

      if (value && index < inputRefs.length - 1) {
        // Move focus to the next input if a letter is typed
        inputRefs[index + 1].current?.focus();
      }

      return newOtp;
    });
  };

  const handleBackspace = (e, index) => {
    if (e.key === 'Backspace' && index > 0 && !otp[`otp_${index + 1}`]) {
      // Move focus to the previous input on backspace if the current input is empty
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerification = async () => {
    if (otp.otp_1 === '' || otp.otp_2 === '' || otp.otp_3 === '' || otp.otp_4 === '') {
      toast.error('All fields are required');
      return;
    }

    try {
      const otp_final = otp.otp_1 + otp.otp_2 + otp.otp_3 + otp.otp_4;
      otp_final.toString();
      const email = localStorage.getItem('userEmail');
      const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URI}/checkOtp/${email}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          otp: otp_final,
        }),
      });

      const data = await response.json();
      if (data.message === 'User authenticated') {
        localStorage.setItem('otpVerified', 'true');
        toast.success('OTP verified');
        setTimeout(() => {
          window.location.replace('/login');
        }, 2000);
      } else {
        toast.error('OTP incorrect');
      }
    } catch (error) {
      console.error('Error sending OTP to API:', error);
    }
  };

  useEffect(() => {
    const otpVerified = localStorage.getItem('otpVerified');
    const companyName = localStorage.getItem('companyName');
    if (otpVerified === 'true') {
      window.location.replace('/login');
    }
    if(companyName){
      window.location.replace("/admin/dashboard");
    }

  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet"
      />
      <Toaster />
      <div className="grid items-center justify-center min-h-screen">
        <div className="text-center text-black">
          <h1 className="font-bold text-4xl mb-6">Welcome to Attendance System</h1>
          <p className="text-lg mb-4">
            We have sent you an OTP on your mail. Enter the OTP below to proceed.
          </p>
          <div className="p-4 bg-[rgba(255, 255, 255, 0.8)] rounded-xl">
            <div className="flex items-center justify-center">
              {inputRefs.map((ref, index) => (
                <input
                  key={index}
                  id={`otp_${index + 1}`}
                  ref={ref}
                  value={otp[`otp_${index + 1}`]}
                  className="border-2 text-center border-blue-700 bg-white text-gray-800 rounded-lg p-3 m-2 w-[40px] h-[40px]"
                  onChange={(e) => handleInputChange(e, index)}
                  onKeyDown={(e) => handleBackspace(e, index)}
                />
              ))}
            </div>
            <button
              onClick={handleVerification}
              className="bg-blue-700 text-white px-6 py-3 m-4 rounded-lg hover:bg-blue-800 transition-all duration-300"
            >
              Verify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;
