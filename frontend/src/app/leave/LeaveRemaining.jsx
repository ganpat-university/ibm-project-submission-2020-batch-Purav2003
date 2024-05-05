import { useState, useEffect } from "react";
import Loading from "../../loading"



const Leave = () => {
    const [leave, setLeave] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchLeave = async () => {
        const id = localStorage.getItem("id");
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/leaveRemaining/${id}`, {
          method: "GET",
        });        
        const data = await response.json();
        setLeave(data);
        setLoading(false);
    }

    useEffect(() => {
        setLoading(true);
        fetchLeave();
    }, []);

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-lg font-semibold text-gray-800 mb-6">Leave Remaining</h1>
           {loading?<Loading />: <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {leave && Object.keys(leave).map((leaveType, index) => (
                    <div key={index} className="border rounded-lg p-6 bg-white">
                        <h2 className="text-xl font-semibold mb-4">{leaveType}</h2>
                        <div>
                            <p className="text-gray-600">Total Count: {leave[leaveType]?.total}</p>
                            <p className="text-gray-600">Remaining Count: {leave[leaveType]?.remaining}</p>
                        </div>
                    </div>
                ))}
            </div>}
        </div>
    );
}

export default Leave;
