import React from 'react';
import BarChart from './BarChart';
import LineChart from './LineChart';
import PieChart from './PieChart';
import ScatterPlot from './ScatterPlot'; // Import ScatterPlot component

const ChartDisplay = ({ chartConfigs, data }) => {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {chartConfigs.map((config, index) => {
                if (!config.chartType || !config.selectedY) return null;

                // Format the data based on the selected chart type
                const chartData = data.map(item => ({
                    x: config.selectedX ? item[config.selectedX.value] : null,
                    y: item[config.selectedY.value],
                    color: config.color
                }));

                if (config.chartType.value === 'pie') {
                    // Format data for the Pie chart
                    const pieData = data.map(item => ({
                        label: config.selectedX ? item[config.selectedX.value] : item[config.selectedY.value],
                        value: item[config.selectedY.value]
                    }));
                    return (
                        <div key={index} style={{ flex: '1 1 300px', minWidth: '300px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
                            <PieChart data={pieData} />
                        </div>
                    );
                }

                return (
                    <div key={index} style={{ flex: '1 1 300px', minWidth: '300px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
                        {config.chartType.value === 'bar' && <BarChart data={chartData} color={config.color} />}
                        {config.chartType.value === 'line' && <LineChart data={chartData} color={config.color} />}
                        {config.chartType.value === 'scatter' && <ScatterPlot data={chartData} color={config.color} />}
                    </div>
                );
            })}
        </div>
    );
};

export default ChartDisplay;
