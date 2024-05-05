"use client";
import Sidebar from "../Sidebar"
import Footer from '../footer';
import { useState, useEffect } from "react";
import Link from "next/link";
import { LuUser2 } from "react-icons/lu";
import { Image } from "antd";
import Loading from "../../loading"
// interface UserData {
//   name: string;
//   email: string;
//   mobile: string;
//   department: string;
//   profilePhoto: any;
// }

const UserProfile = () => {
  const [data, setData] = useState();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    department: '',

  });


  let id;
  if (typeof window !== 'undefined') {
    id = window.localStorage.getItem("id");
  }
  

  const fetchData = async () => {
    const id = localStorage.getItem("id")
    const API_URL = `${process.env.NEXT_PUBLIC_BASE_URI}/user/${id}`;
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
      const data_new = await response.json();
      if(data_new){        
        setData(data_new);        
              setFormData({
                name: data_new.name,
                email: data_new.email,
                mobile: data_new.mobile,
                department: data_new.department,
              });
      }
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
      window.location.replace('/login');
    }
    if(companyName){
      window.location.replace("/admin/dashboard");
    }
    const userData = localStorage.getItem("isAuthorized")
    
    if(userData === "sendRequest"){
      window.location.replace('/landing')
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
      <Sidebar />
    <div className="w-full lg:ml-12">
      <div className="min-h-screen w-full items-center justify-center bg-white font-sans">
<div className="flex min-h-screen items-center justify-center">
        <div className="mt-8 lg:mt-0 md:mt-0 bg-white w-full max-w-2xl p-8 rounded-md lg:shadow-md">
          <h1 className="lg:text-[27px] lg:ml-0 sm:ml-8 ml-4 mt-12 lg:mt-0 text-xl flext items-center gap-3 font-bold text-gray-800 flex items-center mb-6"><LuUser2 className="text-[27px] items-center justify-center mt-[2px]" /> User Profile</h1>

       {loading?<Loading />:<div className="lg:flex sm:flex items-center space-x-4">
            <div
              className="lg:flex flex items-center justify-center cursor-pointer"              
            >
              <Image width={200} height={200}
                src={`http://localhost:8000${data?.profilePhoto}`}
                className="rounded-full lg:w-[150px] w-[150px] h-[150px] lg:h-[200px] object-cover border-2 border-gray-300"
                alt="User Profile"
              />
            </div>
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
                      Department:
                    </label>
                    <p className="text-md">
                      {formData?.department}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex ml-4 mt-4">
                <Link href={`/profile/editProfile/${id}`}><button className="px-4 py-2 border border-green-500 bg-green-500 text-white rounded-md">Edit Profile</button></Link>
                <Link href={`/reset-password`}><button className="ml-8 px-4 py-2 border border-blue-500 bg-blue-500 text-white rounded-md">Reset Password</button></Link>
              </div>
            </div>
          </div>}
        </div>
        </div>

        {showModal && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
            <div className="bg-white p-8 rounded-lg">
              <img
                src={`http://localhost:8000${data?.profilePhoto}`}
                className="rounded-full w-64 h-64 object-cover border-2 border-gray-300 mb-4"
                alt="User Profile"
              />
              <button
                className="w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600"
                onClick={() => setShowModal(false)}
              >
                Go Back
              </button>

            </div>
          </div>
        )}<br></br>
      </div>
      <Footer />
    </div>
    </div>
  );
}

export default UserProfile;