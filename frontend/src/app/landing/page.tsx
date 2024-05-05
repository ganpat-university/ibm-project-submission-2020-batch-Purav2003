"use client";
import Link from 'next/link';
import React from 'react';
import { useState,useEffect } from 'react';
const Landing = () => {
        const [datab, setDatab] = useState({});
        const fetchData = async () => {
            let id:any = localStorage.getItem("id");
            let idAsInt = parseInt(id, 10);
            const API_URL = `${process.env.NEXT_PUBLIC_BASE_URI}/user/${idAsInt}`;
    
            const token = localStorage.getItem("token");
    
            try {
                const response = await fetch(API_URL, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `${token}`,
                    },
                });
                const data_new = await response.json();
                setDatab(data_new);
                if(data_new.isAuthorized === "AccessGranted"){
                    localStorage.setItem("isAuthorized",data_new.isAuthorized)
                    window.location.replace('/dashboard')
                }                   
                console.log(data_new)
            } catch (error) {
                console.error(error);
            }
        };
    
        useEffect(() => {
            const isAuthorized = localStorage.getItem("isAuthorized")
            if(isAuthorized === "AccessGranted"){
                window.location.replace('/dashboard')
            }            
            fetchData();
        }, []);
  return (
    <div className='min-h-screen bg-gray-100'>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
  
    <div className='grid items-center justify-center min-h-screen'>
    
  
      <div className='p-4'>
        <h1 className="font-bold text-3xl mb-4 text-black">Request Sent to Admin</h1>
        <p className="text-lg text-black">Your request has been submitted to the admin. You will receive a confirmation shortly.</p>      
      </div>
    </div>
  </div>
  
  );
}

export default Landing;       