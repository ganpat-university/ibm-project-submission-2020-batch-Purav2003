import React, { useEffect, useRef, useState } from 'react';
import { Select } from 'antd';
import Chart from 'chart.js/auto';

const { Option } = Select;

const PresentDayWisePie = ({ data, setSelectedMonth, setSelectedYear, selectedMonth, selectedYear }) => {
    // const chartContainer = useRef(null);
    // const chartInstance = useRef(null);
    // const [pieData, setPieData] = useState([]);

    // const handleYearChange = (value) => {
    //     setSelectedYear(value);
    // };

    // const handleMonthChange = (value) => {
    //     setSelectedMonth(value);
    // };

    // useEffect(() => {
    //     if (chartInstance.current) {
    //         chartInstance.current.destroy();
    //     }

    //     const dates = data?.length > 0 && data?.map((item) => item.date);
    //     const today = new Date();
    //     const notGreaterThanToday = dates?.length > 0 && dates?.filter((date) => new Date(date) <= today);
    //     const uniqueDates = notGreaterThanToday && [...new Set(notGreaterThanToday)];
    //     const presentDayWise = uniqueDates && uniqueDates?.map((date) => {
    //         const present = data.filter((item) => item.date === date && item.attendance);
    //         return { date, present: present.length };
    //     });

    //     const pieChartData = presentDayWise && presentDayWise?.map((item) => {
    //         return { label: item.date, value: item.present };
    //     });

    //     setPieData(pieChartData || []); // Set pieData or empty array if no data

    //     const ctx = chartContainer.current.getContext('2d');
    //     let labels = []
    //     let values = []
    //     pieData?.forEach((item) => {
    //         labels.push(item.label);
    //         values.push(item.value);
    //     });
    //     chartInstance.current = new Chart(ctx, {
    //         type: 'pie',
    //         data: {
    //             labels: labels,
    //             datasets: [{
    //                 data: values,
    //                 backgroundColor: [
    //                     'rgba(255, 99, 132, 0.7)',
    //                     'rgba(54, 162, 235, 0.7)',
    //                     'rgba(255, 206, 86, 0.7)',
    //                     'rgba(75, 192, 192, 0.7)',
    //                     'rgba(153, 102, 255, 0.7)',
    //                     'rgba(255, 159, 64, 0.7)',
    //                     'rgba(50, 205, 50, 0.7)',
    //                     'rgba(220, 20, 60, 0.7)',
    //                     'rgba(0, 191, 255, 0.7)',
    //                     'rgba(255, 140, 0, 0.7)',
    //                     'rgba(255, 0, 255, 0.7)',
    //                     'rgba(128, 0, 0, 0.7)',
    //                 ],
    //             }],
    //         },
    //         options: {
    //             responsive: true,
    //             maintainAspectRatio: false,
    //             plugins: {
    //                 legend: {
    //                     position: 'top',
    //                 },            
    //             },
    //         },
    //     });

    //     return () => {
    //         if (chartInstance.current) {
    //             chartInstance.current.destroy();
    //         }
    //     };
    // }, [data]);

    return (
        <div className="grid">
            <p>Hello</p>
            {/* <div>
                <Select
                    placeholder="Select Year"
                    className="z-0"
                    value={selectedYear}
                    onChange={handleYearChange}
                    style={{ width: 120, marginRight: 10 }}
                >
                    <Option value="2023">2023</Option>
                    <Option value="2024">2024</Option>
                </Select>
                <Select
                    placeholder="Select Month"
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    style={{ width: 120 }}
                >
                    <Option value="01">January</Option>
                    <Option value="02">February</Option>
                    <Option value="03">March</Option>
                    <Option value="04">April</Option>
                    <Option value="05">May</Option>
                    <Option value="06">June</Option>
                    <Option value="07">July</Option>
                    <Option value="08">August</Option>
                    <Option value="09">September</Option>
                    <Option value="10">October</Option>
                    <Option value="11">November</Option>
                    <Option value="12">December</Option>
                </Select>
            </div>
            <div className='w-full'>
                <canvas ref={chartContainer} />
            </div>
            {data?.length === 0 && (
                <h1 className="my-4 bg-gray-200 w-64 h-64 flex items-center justify-center rounded-md">No Data</h1>
            )} */}
        </div>
    );
};

export default PresentDayWisePie;
