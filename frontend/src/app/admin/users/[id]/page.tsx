// import Sidebar from "../Sidebar"
"use client";
// import Sidebar from "../navbar";
import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import Link from "next/link";
import Adminnavbar from "@/app/AdminNavbar";
interface UserData {
  name: string;
  email: string;
  mobile: string;
  department: string;
  profilePhoto: string;  
}

const ProfileUser = () => {
  const [data, setData] = useState<UserData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    department: '',

  });


  const id = window.location.pathname.split('/').pop();


  const fetchData = async () => {
    const id = window.location.pathname.split('/').pop();
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
      const data_new: UserData = await response.json();
      setData(data_new);

      setFormData({
        name: data_new.name,
        email: data_new.email,
        mobile: data_new.mobile,
        department: data_new.department,
      });
      console.log(data_new);
    } catch (error) {
      console.error(error);
    }
  };




  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.replace('/login');
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
    <><Adminnavbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
        <Toaster />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap"
          rel="stylesheet"
        />

        <div className="bg-white w-full max-w-xl p-8 rounded-md shadow-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">User Profile</h1>

          <div className="flex items-center space-x-4">
            <div
              className="flex items-center justify-center cursor-pointer"
              onClick={() => setShowModal(true)}
            >
              <img
                src={`http://localhost:8000${data?.profilePhoto}`}
                className="rounded-full w-[200px] h-[200px] object-cover border-2 border-gray-300"
                alt="User Profile"
              />
            </div>
            <div className="flex-1">
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
              <div className="flex mt-4">
                <Link href={`/admin/dashboard/edit/${id}`}><button className="px-4 py-2 border border-green-500 bg-green-500 text-white rounded-md">Edit Profile</button></Link>
                <Link href={`/admin/users/attendance/${id}`}><button className="px-4 py-2 border ml-3 border-blue-500 bg-blue-500 text-white rounded-md">View Attendance</button></Link>
              </div>
            </div>
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
        )}
      </div>
    </>
  );
}

export default ProfileUser;