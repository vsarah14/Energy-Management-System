import React, {useEffect, useState} from 'react';
import {Bar} from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


const ConsumptionChart = ({consumptionData, deviceId}) => {
    const [chartData, setChartData] = useState({
        labels: ['Hours'],
        datasets: [
            {
                // id:1,
                label: 'Hourly Consumption',
                data: 0,
                backgroundColor: 'rgba(75,192,192,0.2)',
                // borderColor: 'rgba(75,192,192,1)',
                // borderWidth: 2,
            },
        ],
    });

       const processConsumptionData = data => {

          return data.map(entry => ({
              deviceId: entry.deviceId,
              timestamp: (new Date(entry.timestamp).getHours() + 1) % 24,
              hourlyConsumption: entry.totalConsumption,
          }));
      };

    useEffect(() => {
        if (
            !consumptionData ||
            !Array.isArray(consumptionData) ||
            consumptionData.length === 0 ||
            consumptionData[0].deviceId !== deviceId
        ) {
            return;
        }

            const processedData = processConsumptionData(consumptionData);
            setChartData({
                labels: processedData.map(entry => entry.timestamp),
                datasets: [
                    {
                        label: 'Hourly Consumption',
                        data: processedData.map(entry => entry.hourlyConsumption),
                        backgroundColor: 'rgba(75,192,192,0.2)',
                        borderColor: 'rgba(75,192,192,1)',
                        borderWidth: 2,
                    },
                ],
            });

    }, [consumptionData]);

  //  useEffect(()=>{
  //      console.log(chartData)
   //     }
   //     ,[chartData]
   // )

    return (
        <div>
            <Bar data={chartData}
                 options={{
                     plugins: {
                         title: {
                             display: true,
                             text: "Consumption data"
                         },
                         legend: {
                             display: false
                         }
                     }
                 }}
            />
        </div>
    );
};

export default ConsumptionChart;