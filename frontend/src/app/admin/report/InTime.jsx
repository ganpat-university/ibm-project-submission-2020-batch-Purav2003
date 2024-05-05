import React from 'react';
import CountHours from '@/Helpers/CountHours';
import { Select } from 'antd';
import ReactApexChart from 'react-apexcharts';
const { Option } = Select;

const InTime = ({ data, users, workingHoursUserId, setWorkingHoursUserId, setWorkingHoursMonth, setWorkingHoursYear, workingHoursMonth, workingHoursYear, type = null }) => {
  const { calculateDuration } = CountHours();

  // Data preparation for line chart of InTime
  const entryTimes = data?.length > 0 && data?.map((item) => item.entry);
  const present = data?.length > 0 && data?.filter((item) => item.attendance === true);
  const workingHours = present?.length > 0 && present?.map((item) => calculateDuration(item.entry, item.exit_time));
  const date = data?.length > 0 && data?.map((item) => item.date);
  const uniqueEntryTimes = entryTimes && [...new Set(entryTimes)];
  const inTime = uniqueEntryTimes && uniqueEntryTimes?.map((entry) => {
    const present = data.filter((item) => item.entry === entry);
    return { entry, present: present.length };
  });

  const handleYearChange = (value) => {
    setWorkingHoursYear(value);
  };

  const handleMonthChange = (value) => {
    setWorkingHoursMonth(value);
  };

  const handleEmployeeChange = (value) => {
    setWorkingHoursUserId(value);
  };

  // Prepare data for ApexCharts
  const chartData = entryTimes.toString().split(',').map((item) => parseInt(item, 10));

  return (
    <div>
      <Select
        placeholder="Select Year"
        className="z-0"
        value={workingHoursYear}
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
        value={workingHoursMonth}
        onChange={handleMonthChange}
        style={{ width: 120, marginRight: 10 }}
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
      {type !== "user" && (
        <Select
          placeholder="Select Employee"
          value={workingHoursUserId === 0 ? "All" : workingHoursUserId}
          onChange={handleEmployeeChange}
          style={{ width: 120, marginRight: 10 }}
        >
          <Option value="0">All</Option>
          {users?.map((name) => (
            <Option key={name.id} value={name.id}>{name.name}</Option>
          ))}
        </Select>
      )}
      <ReactApexChart
        options={{
          chart: {
            type: 'area',
          },
          xaxis: {
            categories: date, // Use date array for x-axis categories
          },
          dataLabels: {
            enabled: false
          },
          markers: {
            size: 0
          },
          tooltip: {
            enabled: true,
            shared: true,
            intersect: false,
            y: {
              formatter: function (val) {
                return val
              }
            }
          },
          colors: ['#5A67D8'],
        }}
        series={[{ name: 'Working Hours', data: chartData }]}
        type="area"
        height={400}
        width={700}
      />
    </div>
  );
};

export default InTime;
