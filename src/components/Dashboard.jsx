import React, { useEffect, useState } from 'react';
import apiMiddleware from '../middleware/apiMiddleware';

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Gọi API với middleware
    const fetchData = async () => {
      try {
        const response = await apiMiddleware.get('/api/protected-data');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching protected data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
