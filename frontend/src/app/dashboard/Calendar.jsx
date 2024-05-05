"use client";
import { useState, useEffect } from "react";
import { Calendar, Badge } from 'rsuite';

const Calendars = (props) => {
    const [datesWithBadges, setDateWithBadges] = useState([]);
    const [leave, setLeave] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const selectedMonth = props.selectedMonth;
    const selectedYear = props.selectedYear;

    const fetchAbsent = async () => {
        const id = localStorage.getItem("id");
        const API_URL = `${process.env.NEXT_PUBLIC_BASE_URI}/absent/${id}`;
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(API_URL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `${token}`,
                },
            });
            const data = await response.json();
            setDateWithBadges(data);
        } catch (error) {
            console.error(error);
        }
    }

    const fetchHolidays = async () => {
        const companyCode = localStorage.getItem("cc");
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/getHolidays/${companyCode}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const res = await response.json()            
            const temp = res[0].dates?.match(/'(.*?)'/g)?.map(value => value.replace(/'/g, '')) || []
        //    setHolidays(res[0].dates?.match(/'(.*?)'/g)?.map(value => value.replace(/'/g, '')) || [])
           setHolidays(temp.map(value => {
            const parts = value.split('/');
            // Rearrange the parts to yyyy-mm-dd format
            
            return `${parts[2]}-${parts[1].length>1?parts[1]:"0"+parts[1]}-${parts[0].length>1?parts[0]:"0"+parts[0]}`;
        }) || []);
                      

        }
        catch (err) {
            console.log(err)
        }

    }

    const fetchLeave = async () => {
        const id = localStorage.getItem("id");
        const API_URL = `${process.env.NEXT_PUBLIC_BASE_URI}/leave/${id}`;
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(API_URL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `${token}`,
                },
            });
            const data = await response.json();
            setLeave(data);
        } catch (error) {
            console.error(error);
        }
    }

    console.log(leave)
    console.log(holidays)
    const renderCell = (date) => {
        const dateString = date.toISOString().split('T')[0];
        const hasBadge = datesWithBadges.includes(dateString);
        const leaveData = leave.includes(dateString);
        const holidayData = holidays.includes(dateString);

        return (
            <div style={{ height: '100%', width: '100%' }}>
                {hasBadge && <Badge content='A' style={{ backgroundColor: 'red', color: 'white', marginTop: 2 }} />}
                {leaveData && <Badge content='L' style={{ backgroundColor: 'skyblue', color: 'white', marginTop: 2 }} />}
                {holidayData && <Badge content='H' style={{ backgroundColor: 'green', color: 'white', marginTop: 2 }} />}
            </div>
        );
    };

    useEffect(() => {
        fetchAbsent();
        fetchLeave();
        fetchHolidays();

    }, [selectedYear, selectedMonth]);

    const calendarKey = `${selectedYear}-${selectedMonth}`;

    return (
        <div style={{ width: 280}}>
            <Calendar
                key={calendarKey}
                defaultValue={new Date(`${selectedYear}-${selectedMonth}`)}
                compact bordered renderCell={renderCell}
                style={{zIndex:0}}
            />
        </div>
    );
};

export default Calendars;
