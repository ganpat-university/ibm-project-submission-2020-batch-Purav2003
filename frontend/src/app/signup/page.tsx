// Import necessary dependencies and styles
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { toast, Toaster } from 'react-hot-toast';
import helloImage from '../../assets/images/login.jpg';
import logo from '../../assets/images/logo.png';

// Define the Signup component
const Signup = () => {
    const [step, setStep] = useState(1);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        mobile: '',
        companyCode: '',
        department: '',
    });

    // Function to handle file change for the profile photo
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];

        if (file) {
            setSelectedFile(file);
        }
    };

    // Function to handle moving to the next step
    const handleNextClick = () => {
        setStep((prevStep) => prevStep + 1);
    };

    // Function to handle moving back to the previous step
    const handleBackClick = () => {
        setStep((prevStep) => Math.max(prevStep - 1, 1));
    };

    // Function to handle input changes in the form
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    // Function to handle signup submission
    const handleSignupClick = async (e: React.FormEvent) => {
        e.preventDefault();
        if((formData.name === '' || formData.email === '' || formData.password === '')) {
            toast.error('All fields are required');
            setStep(1);
            return;
        }
        if(!selectedFile) {
            toast.error('Profile photo is required');
            setStep(2);
            return;
        }
        if((formData.mobile === '' || formData.companyCode === '' || formData.department === '')) {
            toast.error('All fields are required');
            setStep(3);
            return;
        }

        // Create FormData object to send data
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('mobile', formData.mobile);
        formDataToSend.append('companyCode', formData.companyCode);
        formDataToSend.append('department', formData.department);
        if (selectedFile) {
            formDataToSend.append('profilePhoto', selectedFile);
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/signup/`, {
                method: 'POST',
                body: formDataToSend,
            });

            const data = await response.json();
            console.log(data);

            if (data.status === 'success') {
                toast.success('Successfully signed up');
                localStorage.setItem('userEmail', data.email);
                localStorage.setItem('otpVerified', 'false');
                window.location.replace('/verification');
            } else {
                toast.error(data.message);
                if (data.message === 'Email already exists') {
                    setStep(1);
                } else if (data.message === 'Mobile already exists') {
                    setStep(3);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <Toaster />

            {/* Main content of the Signup component */}
            <div className="flex justify-center items-center w-full min-h-screen bg-gray-100">
                <div className="lg:w-1/2 p-16 bg-white rounded-md shadow-lg">
                    <h1 className="text-3xl font-extrabold text-gray-800">Sign up</h1>
                    <form className="mt-4">
                        {/* Form fields */}
                        {/* Step 1 */}
                        {step === 1 && (
                            <>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Your Name
                                    </label>
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
                                </div><br></br>
                                <button
                                    type="button"
                                    onClick={handleNextClick}
                                    className="float-right bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue"
                                >
                                    Next
                                </button>
                            </>
                        )}

                        {/* Step 2 */}
                        {step === 2 && (
                            <>
                                <label htmlFor="profile-photo" className="block text-sm font-medium text-gray-700 mb-2">
                                    Upload Photograph
                                </label>
                                <div className="flex items-left">
                                    <label
                                        htmlFor="profile-photo"
                                        className="cursor-pointer border-2 border-gray-300 rounded-md p-4"
                                    >
                                        {selectedFile ? (
                                            <img
                                                src={URL.createObjectURL(selectedFile)}
                                                alt="Selected Profile Photo"
                                                className="w-[180px] h-[180px] object-cover rounded-md"
                                            />
                                        ) : (
                                            <div className='w-[160px] h-[160px] rounded-md'></div>
                                        )}
                                        <input
                                            type="file"
                                            id="profile-photo"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                </div>
                                <div className="flex justify-between mt-4">
                                    <button
                                        type="button"
                                        onClick={handleBackClick}
                                        className=" bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline-gray"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNextClick}
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue"
                                    >
                                        Next
                                    </button>
                                </div>
                            </>

                        )}

                        {/* Step 3 */}
                        {step === 3 && (
                            <>
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
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                                        Your Department
                                    </label>
                                    <input
                                        type="text"
                                        id="department"
                                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:border-blue-500"
                                        placeholder="Enter your Department"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        required
                                    />
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
                                <br />
                                <div className="w-full"></div>
                            </>
                        )}
                    </form>
                    {/* Navigation links */}
                    <div className="mt-4">
                        <Link href="/login" passHref>
                            <p className="text-blue-500 hover:underline inline-block">Back to Login</p>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Signup;
