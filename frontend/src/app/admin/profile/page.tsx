"use client";
import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import Link from "next/link";
import Loading from "../../../loading"
import Adminnavbar from '@/app/AdminNavbar';
interface UserData {
  name: string;
  email: string;
  mobile: string;
  companyCode: any;
  companyName: any;
  department: string;
}

const AdminProfile = () => {
  const [data, setData] = useState<UserData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    department: '',
    companyCode: '',
    companyName: '',
  });


// const id = localStorage.getItem("id");


  const fetchData = async () => {
    const id = localStorage.getItem("id")
    const API_URL = `${process.env.NEXT_PUBLIC_BASE_URI}/admin/${id}`;
    console.log(API_URL);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `${token}`,
        },
      });
      const data_new: UserData = await response.json();
      setData(data_new);

      setFormData({
        name: data_new.name,
        email: data_new.email,
        mobile: data_new.mobile,
        department: data_new.department,
        companyCode: data_new.companyCode,
        companyName: data_new.companyName,
      });
      setLoading(false);
      console.log(data_new);
    } catch (error) {
      console.error(error);
    }
  };




  useEffect(() => {
    const token = localStorage.getItem("token");
    const companyName = localStorage.getItem("companyName");
    if (!token) {
      window.location.replace('/admin/login');
    }
    if(!companyName){
      window.location.replace("/dashboard");
    }
    const userData = localStorage.getItem("isAuthorized")
      if (userData === "false") {
          window.location.replace("/admin/login");
      }

    fetchData();
  }, []);

  useEffect(() => {
    if (showModal) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [showModal]);

  return (
    <div className="w-full flex relative ">
      <Adminnavbar />
    <div className="w-full ml-12">
      <div className="min-h-screen w-full items-center justify-center bg-white font-sans">

        <Toaster />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
<div className="flex min-h-screen items-center justify-center">
        <div className="mt-8 lg:mt-0 md:mt-0 bg-white w-full max-w-2xl p-8 rounded-md shadow-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-6"> Admin Profile</h1>

       {loading?<Loading />:<div className="lg:flex sm:flex items-center space-x-4">
           
            <div className="lg:flex-1">
              <div className="lg:flex-1 sm:flex-1 grid ml-4 lg:grid-cols-2 sm:grid-cols-2 w-full">
                <div>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-md font-medium text-gray-600">
                      Name:
                    </label>
                    <p className="text-md">{formData?.name}</p>

                  </div>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-md font-medium text-gray-600">
                      Mobile:
                    </label>
                    <p className="text-md">
                      {formData?.mobile}
                    </p>
                  </div>

                </div>
                <div>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-md font-medium text-gray-600">
                      Email:
                    </label>
                    <p className="text-md">
                      {formData?.email}
                    </p>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-md font-medium text-gray-600">
                      Company Code:
                    </label>
                    <p className="text-md">
                      {formData?.companyCode}
                    </p>
                  </div>
                
                </div>

                <div>
                  
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-md font-medium text-gray-600">
                      Company Name:
                    </label>
                    <p className="text-md">
                      {formData?.companyName}
                    </p>
                  </div>
                
                </div>



              </div>
              {/* <div className="flex ml-4 mt-4">
                <Link href={`/profile/editProfile/${id}`}><button className="px-4 py-2 border border-green-500 bg-green-500 text-white rounded-md">Edit Profile</button></Link>
              </div> */}
              <div className="flex ml-4 mt-4">
                <Link href="/admin/holiday"><button className="px-4 py-2 border border-green-500 bg-green-500 text-white rounded-md">Add Holidays</button></Link>
              </div>
            </div>
          </div>}
        </div>
        </div>

       
      </div>
    </div>
    </div>
  );
}

export default AdminProfile;