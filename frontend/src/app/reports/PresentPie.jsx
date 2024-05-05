import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import Chart from 'react-apexcharts';

const { Option } = Select;

const PresentPie = ({ data, setSelectedMonth, setSelectedYear, selectedMonth, selectedYear }) => {
    const [chartOptions, setChartOptions] = useState({
        series: [],
        options: {
            chart: {
                type: 'pie',
            },
            labels: ['Present', 'Absent'],
            legend: {
                position: 'top',
            },
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: false,
                    zoom: false,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                    reset: false,
                    customIcons: []
                },
                export: {
                    csv: {
                        filename: 'chart-data',
                        columnDelimiter: ',',
                        headerCategory: 'category',
                        headerValue: 'value',
                        dateFormatter(timestamp) {
                            return new Date(timestamp).toISOString()
                        }
                    },
                    svg: {
                        filename: 'chart-data'
                    },
                    png: {
                        filename: 'chart-data'
                    }
                },
            },
        },
    });

    const handleYearChange = (value) => {
        setSelectedYear(value);
    };

    const handleMonthChange = (value) => {
        setSelectedMonth(value);
    };

    useEffect(() => {
        if (data && typeof data.total_present !== 'undefined' && typeof data.total_absent !== 'undefined') {
            const totalPresent = data.total_present;
            const totalAbsent = data.total_absent;

            setChartOptions(prevOptions => ({
                ...prevOptions,
                series: [totalPresent, totalAbsent],
            }));
        }
    }, [data]);

    return (
        <div className="grid">
            <div>
                <Select
                    placeholder="Select Year"
                    className="z-0"
                    value={selectedYear}
                    onChange={handleYearChange}
                    style={{ width: 120, marginRight: 10 }}
                >
                    <Option value="2023">2023</Option>
                    <Option value="2024">2024</Option>
                    {/* Add more years as needed */}
                </Select>
                {/* Dropdown for Month */}
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
            <div className='w-full mt-8'>
                <Chart
                    options={chartOptions.options}
                    series={chartOptions.series}
                    type='pie'
                    width='70%'
                />
            </div>
            {(data && typeof data.total_present === 'undefined' && typeof data.total_absent === 'undefined') && (
                <h1 className="my-4 bg-gray-200 w-64 h-64 flex items-center justify-center rounded-md">No Data</h1>
            )}
        </div>
    );
};

export default PresentPie;
