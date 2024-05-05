"use client";
import React from 'react';
import Adminnavbar from '@/app/AdminNavbar';
import ApproveLeave from './ApproveLeave';
import ApprovedLeave from './ApprovedLeave';
import TodayOnLeave from './TodayOnLeave';
const AdminLeave = () => {
  return (
    <>
      <Adminnavbar /><br></br><br></br><br></br>
      
          <ApproveLeave />
        <div className='flex'><ApprovedLeave />
          <TodayOnLeave /></div>
    
    </>
  );
}

export default AdminLeave;