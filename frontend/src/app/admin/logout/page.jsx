"use client"
import React, { useEffect } from 'react';

const AdminLogout = () => {
    useEffect(()=>{
        localStorage.removeItem("token")
        localStorage.removeItem("companyCode")
        localStorage.removeItem("companyName")
        localStorage.removeItem("id")
        window.location.replace("/admin/login")
    })
  return (
    <div>
      
    </div>
  );
}

export default AdminLogout;