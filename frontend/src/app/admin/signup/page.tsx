"use client";
import hello from '../../../assets/images/login.jpg'
import logo from '../../../assets/images/logo.png'
import { useState } from 'react';
import Link from 'next/link';
import { FcGoogle } from "react-icons/fc";
import { RxUpload } from "react-icons/rx";
import { toast, Toaster } from 'react-hot-toast';

const AdminSignup = () => {
    const [step, setStep] = useState(1);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        rePassword: '',
        mobile: '',
        companyCode: '',
        companyName: '',
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];

        if (file) {
            setSelectedFile(file);
        }
    };

    const handleNextClick = () => {
        setStep((prevStep) => prevStep + 1);
    };

    const handleBackClick = () => {
        setStep((prevStep) => Math.max(prevStep - 1, 1));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSignupClick = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.mobile.length !== 10) {
            toast.error('Mobile number should be 10 digits');
            setStep(1)
            return;
        }
        if (formData.password !== formData.rePassword) {
            toast.error('Passwords do not match');
            setStep(2)
            return;
        }
        if (formData.companyCode.length !== 6) {
            toast.error('Company Code should be 6 digits');
            setStep(2)
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('mobile', formData.mobile);
        formDataToSend.append('companyCode', formData.companyCode);
        formDataToSend.append('companyName', formData.companyName);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/admin/signup`, {
                method: 'POST',
                body: formDataToSend,
            });

            const data = await response.json();
            console.log(data);

            if (data.status === 'success') {
                toast.success('Successfully signed up');
                const timer = setTimeout(() => {
                    window.location.replace('/admin/login');
                }, 2000);
                return () => clearTimeout(timer);
            }
            else {
                toast.error(data.message)
                if (data.message === 'Email already exists') {
                    setStep(1)
                }
                else if (data.message === 'Mobile already exists') {
                    setStep(1)
                }
                else if (data.message === 'Company Code already exists') {
                    setStep(2)
                }
            }
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <>
            <Toaster />

            <link rel="icon" href={logo.src} type="image/icon type" />
            <title>Attendace System</title>
            <div className="flex justify-center items-center w-full min-h-screen bg-gray-100">
                <div className="lg:w-1/2 p-16 bg-white rounded-md shadow-lg">
                    <h1 className="text-3xl font-extrabold text-gray-800">Admin Sign up</h1>
                    <form className="mt-4">
                        {step === 1 && (
                            <>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Your Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:border-blue-500"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Your Email
                                    </label>
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

                                <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                        Your Company&apos;s Name</label>
                                    <input
                                        type="text"
                                        id="companyName"
                                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:border-blue-500"
                                        placeholder="Enter your company's name"
                                        value={formData.companyName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                                        Your Mobile
                                    </label>
                                    <input
                                        type="text"
                                        id="mobile"
                                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:border-blue-500"
                                        placeholder="Enter your Phone Number"
                                        value={formData.mobile}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>


                                <button
                                    type="button"
                                    onClick={handleNextClick}
                                    className="float-right bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue"
                                >
                                    Next
                                </button>                            </>
                        )}
                        {step === 2 && (
                            <>
                                <div>
                                  <div className="mb-4">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Your Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:border-blue-500"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                    <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                            Retype Your Password</label>
                                        <input
                                            type="password"
                                            id="rePassword"
                                            className="repassword w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:border-blue-500"
                                            value={formData.rePassword}
                                            onChange={handleInputChange}
                                            placeholder="Retype your password"
                                        />
                                    </div>
                                    <div className="mb-4">
                                    <label htmlFor="companyCode" className="block text-sm font-medium text-gray-700">
                                        Your Company Code
                                    </label>
                                    <input
                                        type="text"
                                        id="companyCode"
                                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:border-blue-500"
                                        placeholder="Enter your Company Code"
                                        value={formData.companyCode}
                                        onChange={handleInputChange}
                                        required
                                    />

                                    <a className="text-[12px] text-black">It should contain 6 numbers only</a>
                                </div>
                              
                                <div className="flex justify-between mt-4">
                                    <button
                                        type="button"
                                        onClick={handleBackClick}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline-gray"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSignupClick}
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue"
                                    >
                                        Signup
                                    </button>
                                </div>
                                </div>
                            </>
                        )}
                       

                    </form><br></br>
                    <h1 className="text-[black]">Back To <Link href='/admin/login' className='font-bold underline'> Login </Link></h1>

                </div>

            </div>
        </>
    );
}

export default AdminSignup;
