"use client";
import hello from '../../../assets/images/login.jpg'
import logo from '../../../assets/images/logo.png'
import Link from 'next/link';
import { FcGoogle } from "react-icons/fc";
import { useState } from 'react';
import { useEffect } from 'react';
import  { toast, Toaster } from 'react-hot-toast';
const AdminLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''      
    });




    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleLoginClick = async (e: any) => {
        e.preventDefault();
        if(formData.email === '' || formData.password === ''){
            toast.error("All fields are required")
            return
        }
        try {                   
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/admin/login`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            localStorage.removeItem("token");
            localStorage.setItem("token",data.jwt)
            localStorage.setItem("id",data.id)
            localStorage.setItem("companyName",data.companyName)
            localStorage.setItem("companyCode",data.companyCode)
            if (data.status === 'success') {
                console.log('Successfully logged in');
                toast.success("Successfully logged in")
                window.location.replace('/admin/dashboard')
            }
            else{
                toast.error(data.message)
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(()=>{
        const token = localStorage.getItem("token")
        const companyName = localStorage.getItem("companyName")
        if(token && companyName){
            window.location.replace('/admin/dashboard')
        }  
        if(token && !companyName){
           window.location.replace('/login')
        }
    },[])

    return (
        <>  

<div className="flex min-h-screen bg-gray-100">
            <Toaster />

            {/* <div className="hidden lg:block w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${helloImage.src})` }}></div> */}
<div className='w-full min-h-screen items-center flex justify-center'>
            <div className="lg:w-1/2 p-12 items-center p-16 mx-auto bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-extrabold text-gray-800">Admin Login</h1>
                <form className="mt-8">
                    {/* Email Input */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:border-blue-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:border-blue-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {/* Login Button */}
                    <button
                        type="button"
                        onClick={handleLoginClick}
                        className="px-4 py-2 text-white bg-blue-700 rounded-md hover:bg-blue-800 focus:outline-none focus:ring focus:border-blue-300"
                    >
                        Login
                    </button>

                        <br></br><br></br>
                        {/* <div className='flex items-center'>
                            <hr className='w-[170px] bg-[#4a4a4a] h-[1px] border-none'></hr><h1 className='px-2 text-center text-[white]'>OR</h1><hr className='w-[170px] bg-[#4a4a4a] h-[1px] border-none'></hr>
                        </div><br></br> */}
                        <div>
                            <h1 className='text-black'>Employee? <Link href="/login" className="font-bold underline">Login</Link></h1>
                        </div>
                        {/* <center> <div className='bg-[white] w-[53%] p-3 hover:cursor-pointer rounded-lg flex '>
                            <FcGoogle className="text-2xl" />
                            <h1 className='ml-2 font-medium'>Login with Google</h1>
                        </div>
                        </center> */}
                        <br></br>


                        <h1 className='text-[#000]'>Want to create? <Link href="/admin/signup" className="font-bold underline">Signup</Link></h1>
                    </form>
                </div>
            </div>
</div>

        </>
    );
}

export default AdminLogin;