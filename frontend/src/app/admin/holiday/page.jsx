"use client";
import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import Adminnavbar from '@/app/AdminNavbar';

const HolidayComponent = () => {
    const today = new Date();
    const [selectedDates, setSelectedDates] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [data, setData] = useState();
    const handleDateClick = (date) => {
        const selectedDate = `${date}/${currentMonth + 1}/${currentYear}`;
        const selectedDateTime = new Date(`${currentYear}-${currentMonth + 1}-${date}`).getTime();
        const todayDateTime = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

        if (selectedDateTime >= todayDateTime) {
            const selectedIndex = selectedDates.indexOf(selectedDate);
            let newSelectedDates = [...selectedDates];

            if (selectedIndex === -1) {
                newSelectedDates.push(selectedDate);
            } else {
                newSelectedDates.splice(selectedIndex, 1);
            }

            setSelectedDates(newSelectedDates);
        }
    };

    const submitDates = async () => {
        if (selectedDates.length === 0) {
            return toast.error('Please select at least one date');
        }
        if(data?.length === 0){
        const dates = selectedDates
        const companyCode = localStorage.getItem('companyCode')
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/addHolidays/${companyCode}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ dates })
            })
            const data = await response.json()
            console.log(data)
            if (data.status === "success") {
                toast.success("Holidays added successfully")
            }

        }
        catch (err) {
            console.log(err)
        }}

        else{
            const dates = selectedDates
            const companyCode = localStorage.getItem('companyCode')
            console.log(companyCode)
            const requestBody = {
                companyCode: companyCode,
                dates: selectedDates
            };
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/updateHolidays/${companyCode}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                })
                const data = await response.json()
                console.log(data)
                if (data.status === "success") {
                    toast.success("Holidays update successfully")
                }
    
            }
            catch (err) {
                console.log(err)
            }
        }

    }

    const fetchData = async () => {
        const companyCode = localStorage.getItem('companyCode')
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/getHolidays/${companyCode}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const res = await response.json()
            setData(res)
           setSelectedDates(res[0].dates?.match(/'(.*?)'/g)?.map(value => value.replace(/'/g, '')) || [])
              

        }
        catch (err) {
            console.log(err)
        }
    }
    console.log(selectedDates)
    const goToPreviousMonth = () => {
        const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const newYear = currentMonth === 0 ? currentYear : currentYear;
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };

    const goToNextMonth = () => {
        const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        const newYear = currentMonth === 11 ? currentYear : currentYear;
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };

    // Generate a calendar for the current month
    const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const days = Array.from({ length: totalDaysInMonth }, (_, index) => index + 1);
    const emptyDays = Array.from({ length: firstDayOfMonth }, (_, index) => index);


    useEffect(() => {
        fetchData();

    }, [])
    return (
        <>
        <Adminnavbar />
        <div className="container mx-auto max-w-2xl pt-32">
            <Toaster />
            <h2 className="text-3xl font-bold mb-4">Choose Holiday Dates</h2>
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <button className="px-2 py-1 bg-blue-500 text-white rounded" onClick={goToPreviousMonth}>
                        Previous Month
                    </button>
                    <h3 className="text-xl font-semibold">{`${currentYear} / ${currentMonth + 1}`}</h3>
                    <button className="px-2 py-1 bg-blue-500 text-white rounded" onClick={goToNextMonth}>
                        Next Month
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="text-center text-gray-700 font-semibold">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-2 mt-2">
                    {emptyDays.map((_, index) => (
                        <div key={`empty_${index}`} className="text-center"></div>
                    ))}
                    {days.map((day) => (
                        <button
                            key={day}
                            className={`py-2 px-3 rounded-full text-center ${selectedDates.includes(`${day}/${currentMonth + 1}/${currentYear}`) ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'}`}
                            disabled={new Date(`${currentYear}-${currentMonth + 1}-${day}`).getTime() < today.getTime() || 
                            'sunday' === new Date(`${currentYear}-${currentMonth + 1}-${day}`).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() ||
                            'saturday' === new Date(`${currentYear}-${currentMonth + 1}-${day}`).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() }
                            onClick={() => handleDateClick(day)}
                        >
                            {day}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <div className='w-full flex justify-between items-center'>
                    <h3 className="text-xl font-semibold mb-2">Selected Dates:</h3>
                    <h3 className='pr-12 text-md font-semibold mb-2'>Total Dates Selected: {selectedDates.length}</h3>
                </div>

                <div className='border p-4'>

                    {selectedDates.map((date) => (
                        <h1 key={date} className="mb-3 text-sm px-4 py-2 bg-blue-100 rounded-full ml-2 inline-block">{date}</h1>
                    ))}
                    {selectedDates.length === 0 && <p className="text-gray-500">No dates selected</p>}
                </div>
            </div>
{



}

            <div className='my-8'>
                <button type='button' className='bg-blue-500 py-2 px-4 text-white rounded-md inline-block'
                    onClick={submitDates}
                >Submit </button>
            </div>
        </div>
        </>
    );
    
};

export default HolidayComponent;
