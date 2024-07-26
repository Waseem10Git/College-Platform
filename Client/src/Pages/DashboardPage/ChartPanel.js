import React from 'react';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';

const ChartPanel = ({ data, config }) => {
    if (!data || !config) {
        console.error("ChartPanel received invalid data or config");
        return <div>No data or config provided</div>;
    }

    const chartData = {
        labels: data.map(item => item[config.selectedX?.value] || ""),
        datasets: [
            {
                label: config.selectedY?.label || "Data",
                data: data.map(item => item[config.selectedY?.value] || 0),
                backgroundColor: config.color || 'rgba(75,192,192,0.4)',
                borderColor: config.color || 'rgba(75,192,192,1)',
                borderWidth: 1,
            }
        ]
    };

    // Ensure the data is properly formatted and available for rendering
    if (!chartData.labels.length) {
        console.error("No labels available for chart");
        return <div>No valid data for chart</div>;
    }

    const renderChart = () => {
        switch (config.chartType?.value) {
            case 'bar':
                return <Bar data={chartData} />;
            case 'line':
                return <Line data={chartData} />;
            case 'pie':
                return <Pie data={chartData} />;
            case 'scatter':
                return <Scatter data={chartData} />;
            default:
                return <div>Invalid chart type</div>;
        }
    };

    return <div style={{ height: '400px' }}>{renderChart()}</div>;
};

export default ChartPanel;
