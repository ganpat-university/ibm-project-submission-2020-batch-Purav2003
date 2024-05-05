// import Navbar from "../navbar";
"use client";

import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import Link from "next/link";
import Adminnavbar from "@/app/AdminNavbar";
import { Image } from "antd";
interface UserData {
    name: string;
    email: string;
    mobile: string;
    department: string;    
    profilePhoto: any;    
}



const Edit = () => {
    const [data, setData] = useState<UserData | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        department: '',

    });
    const [formDataone, setFormDataone] = useState({
        name: '',
        email: '',
        mobile: '',
        department: '',

    });

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            email: e.target.value,
        });
    };

    const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            mobile: e.target.value,
        });
    };

    const handleDepartmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            department: e.target.value,
        });
    };


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
            setFormDataone({
                name: data_new.name,
                email: data_new.email,
                mobile: data_new.mobile,
                department: data_new.department,
            });
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

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.email === '' || formData.mobile === '' || formData.department === '') {
            toast.error("All fields are required")
            return
        }
        if(formData.email === formDataone.email && formData.mobile === formDataone.mobile && formData.department === formDataone.department){   
            toast.error("No changes made")
            return
        }

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name );
        formDataToSend.append('email', formData.email);
        formDataToSend.append('mobile', formData.mobile);
        formDataToSend.append('department', formData.department);
        const token = localStorage.getItem("token");
        try {
            const id = window.location.pathname.split('/').pop();
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/update/${id}`, {
                method: 'PUT',
                headers: {
                  'Authorization': `${token}`,
              },
                body: formDataToSend,
            });

            const data = await response.json();
            console.log(data);

            if (data.status === 'success') {
                toast.success(data.message);
                fetchData();
            }
            else {
                toast.error(data.message)
            }
        } catch (err) {
            console.error(err);
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

    return (<>
    <Adminnavbar />
<div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
      <Toaster />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      <div className="bg-white w-full overflow-hidden max-w-xl p-8 rounded-md shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">User Profile</h1>

        <div className="flex items-center space-x-4">
          <div
            className="flex items-center justify-center cursor-pointer"            
          >
            <Image width={250} height={250} 
              src={`http://localhost:8000${data?.profilePhoto}`}
              className="rounded-full w-[200px] h-[200px] object-cover border-2 border-gray-300"
              alt="User Profile"
            />
          </div>

          <div className="flex-1">
            <form>
              <div className="mb-4">
                <label htmlFor="name" className="block text-md font-medium text-gray-600">
                  Name:
                </label>
                <span className="hover:cursor-not-allowed">{formData?.name}</span>
              </div>

              <div className="mb-4">
                <label htmlFor="name" className="block text-md font-medium text-gray-600">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full"
                  placeholder="Enter your Email"
                  value={formData?.email}
                  onChange={handleEmailChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="name" className="block text-md font-medium text-gray-600">
                  Mobile:
                </label>
                <input
                  type="text"
                  id="mobile"
                  className="w-full"
                  placeholder="Enter your Moobile"
                  value={formData?.mobile}
                  onChange={handleMobileChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="name" className="block text-md font-medium text-gray-600">
                  Department:
                </label>
                <input
                  type="text"
                  id="department"
                  className="w-full"
                  placeholder="Enter your Department"
                  value={formData?.department}
                  onChange={handleDepartmentChange}
                  required
                />
              </div>
              {/* Repeat the above structure for other form fields */}

              <button
                type="button"
                className="w-[1/2] px-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                onClick={handleUpdate}
              >
                Update Profile
              </button>
              
            </form>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
          <div className="bg-white p-8 rounded-lg">
            <img
              src={`http://localhost:8000${data?.profilePhoto}`}
              className="rounded-full w-32 h-32 object-cover border-2 border-gray-300 mb-4"
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
    </div></>
  );
}

export default Edit;