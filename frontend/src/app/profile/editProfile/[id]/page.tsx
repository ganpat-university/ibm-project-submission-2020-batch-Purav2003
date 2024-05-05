// import Sidebar from "../Sidebar"
"use client";

import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import Link from "next/link";
import Footer from "@/app/footer";
import Sidebar from "@/app/Sidebar";
import Loading from "../../../../loading"
interface UserData {
  name: string;
  email: string;
  mobile: string;
  department: string;
  status: any;
  message: any;
  profilePhoto: any;

}

const EditProfile = () => {
  const [data, setData] = useState<UserData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      name: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      setSelectedFile(file);
    }
  };


  const fetchData = async () => {
    const id = window.location.pathname.split('/').pop();
    const API_URL = `${process.env.NEXT_PUBLIC_BASE_URI}/user/${id}`;
    console.log(API_URL);
    const token = localStorage.getItem("token");
    console.log(token)
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `${token}`,
        },
      });
      const data_new: UserData = await response.json();
      if(data_new.status === "error"){
        toast.error(data_new.message)
      }

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
      setLoading(false);
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
    if (formData.name === formDataone.name && formData.email === formDataone.email && formData.mobile === formDataone.mobile && formData.department === formDataone.department && !selectedFile) {
      toast.error("No changes made")
      return
    }

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('mobile', formData.mobile);
    formDataToSend.append('department', formData.department);
    if (selectedFile) {
      formDataToSend.append('profilePhoto', selectedFile);

    }
    console.log("Sending Data", formDataToSend)
    try {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id")
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/update/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `${token}`
        },
        body: formDataToSend,
      });

      const data = await response.json();
      console.log(data);

      if (data.status === 'success') {
        toast.success(data.message);
        const timer = setTimeout(() => {
        window.location.replace('/profile');
        }
        , 1200);
        fetchData();
        return () => clearTimeout(timer);
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
    const userData = localStorage.getItem("isAuthorized")

    if(userData === "sendRequest"){
      window.location.replace('/landing')
    }

    fetchData();
  }, []);

  useEffect(() => {
    const companyName = localStorage.getItem("companyName");
    if (companyName) {
      window.location.replace('/admin/dashboard');
    }
    if (showModal) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [showModal]);

  return (<div className="w-full flex ">
    <Sidebar/>
    <div className="w-full lg:ml-12">
    <div className="min-h-screen flex items-center justify-center bg-white font-sans">
      <Toaster />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      <div className="bg-white w-full max-w-2xl p-8 rounded-md lg:shadow-md">
        <h1 className="lg:text-3xl lg:ml-0 sm:ml-8 ml-4 mt-12 lg:mt-0 text-xl font-bold text-gray-800 flex items-center mb-6">Edit Your Profile</h1>

{loading?<Loading />:        <div className="lg:flex md:flex items-center">
          <div className="lg:flex-1 md:flex-1">
            <label htmlFor="profile-photo" className="cursor-pointer">
              {selectedFile ? (
                                <div className='lg:w-[200px] lg:h-[200px] md:w-[200px] md:h-[200px] flex items-center justify-center rounded-full'>

                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Selected Profile Photo"
                  className="lg:w-[200px] w-[150px] h-[150px] lg:h-[200px] object-cover rounded-full"
                />
                </div>
              ) : (
                <div className='lg:w-[200px] lg:h-[200px] md:w-[200px] md:h-[200px] flex items-center justify-center rounded-full'>
                  <img
                    src={`http://localhost:8000${data?.profilePhoto}`}
                    alt="Selected Profile Photo"
                    className="lg:w-[200px] w-[150px] h-[150px] lg:h-[200px] object-cover rounded-full"
                  />
                </div>
              )}
              <p className="text-sm mt-2 text-gray-500 text-center">Click to change profile photo</p>
            </label>
            <input
              type="file"
              id="profile-photo"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
        </div>


        <div className="ml-8 w-full mt-8 ">
          <form>
            <div>
              <div className="grid lg:grid-cols-2 md:grid-cols-2  w-full">
                <div>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-md font-medium text-gray-600">
                      Name:
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full"
                      placeholder="Enter your name"
                      value={formData?.name}
                      onChange={handleNameChange}
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

                </div>
                <div>

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
                </div>
              </div>
              {/* Repeat the above structure for other form fields */}
              <div className="mt-4">
                <Link href='/profile'>
                  <button
                    type="button"
                    className="w-[1/2] px-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                  >
                    Go Back
                  </button>
                </Link>
                <button
                  type="button"
                  className="w-[1/2] ml-2 px-4 bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
                  onClick={handleUpdate}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>}
    </div>


  </div > <Footer /></div>
  </div>
  );
}

export default EditProfile;