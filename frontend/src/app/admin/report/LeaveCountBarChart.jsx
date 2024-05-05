import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Select } from 'antd';

const { Option } = Select;

const LeaveCountBarChart = ({ data, setSelectedYear, selectedYear, users, setLeaveUserId, leaveUserId, type = null }) => {
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
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
            headerCategory: 'date',
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
        autoSelected: 'zoom'
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 5,
      },
    },
    xaxis: {
      categories: [],
    },
    legend: {
      position: 'top',
    },
    fill: {
      opacity: 1
    },
  });

  const [series, setSeries] = useState([]);

  useEffect(() => {
    if (!data || data.length === 0) {
      setSeries([]);
      setChartOptions(prevOptions => ({
        ...prevOptions,
        xaxis: {
          categories: []
        }
      }));
      return;
    }

    const months = [];
    const userData = {};

    data.forEach(entry => {
      const month = Object.keys(entry)[0];
      months.push(month);

      const leaveData = entry[month];
      
      for (const user in leaveData) {
        if (!userData[user]) {
          userData[user] = [];
        }
        userData[user].push(leaveData[user]);
      }
    });

    setChartOptions(prevOptions => ({
      ...prevOptions,
      xaxis: {
        categories: months
      }
    }));

    const seriesData = Object.entries(userData).map(([user, leaves]) => ({
      name: user,
      data: leaves
    }));
    setSeries(seriesData);
  }, [data]);

  const handleYearChange = (value) => {
    setSelectedYear(value);
  };

  const handleEmployeeChange = (value) => {
    setLeaveUserId(value);
  };

  return (
    <div>
      <div className="flex mb-4 z-10">
        <Select placeholder="Select Year" value={selectedYear} onChange={handleYearChange} style={{ width: 120, marginRight: 10 }}>
          <Option value="2023">2023</Option>
          <Option value="2024">2024</Option>
          {/* Add more years as needed */}
        </Select>
        {type !== "user" && (
          <Select placeholder="Select Employee" value={leaveUserId === 0 ? "All" : leaveUserId} onChange={handleEmployeeChange} style={{ width: 120, marginRight: 10 }}>
            <Option value="0">All</Option>
            {users?.map((name) => (
              <Option key={name.id} value={name.id}>{name.name}</Option>
            ))}
          </Select>
        )}
      </div>
      <div className='w-[400px]'>
        <ReactApexChart options={chartOptions} series={series} type="bar" height={300} />
      </div>
    </div>
  );
};

export default LeaveCountBarChart;
