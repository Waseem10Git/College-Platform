import React, { useState } from 'react';
import ChartForm from './ChartForm';
import ChartDisplay from './ChartDisplay';
import './Dashboard.css'
const data = [
    { category: 'A', value: 30, count: 50 },
    { category: 'B', value: 80, count: 70 },
    { category: 'C', value: 45, count: 60 },
    { category: 'D', value: 60, count: 90 },
    { category: 'E', value: 20, count: 40 },
];

const data2 = [
    { date: '2022-01-01', value: 10, count: 50 },
    { date: '2022-02-01', value: 30, count: 70 },
    { date: '2022-03-01', value: 40, count: 60 },
    { date: '2022-04-01', value: 20, count: 90 },
    { date: '2022-05-01', value: 60, count: 40 },
    { date: '2022-06-01', value: 70, count: 60 },
    { date: '2022-07-01', value: 65, count: 40 },
    { date: '2022-08-01', value: 30, count: 20 },
    { date: '2022-09-01', value: 45, count: 60 },
    { date: '2022-10-01', value: 55, count: 70 },
    { date: '2022-11-01', value: 40, count: 45 },
    { date: '2022-12-01', value: 60, count: 60 },
];

const allData = [...data, ...data2];

const DashboardPage = ({language, isDarkMode}) => {
    const [chartConfigs, setChartConfigs] = useState([]);

    const handleFormChange = (configs) => {
        setChartConfigs(configs);
    };

    const handleDeleteChart = (index) => {
        const newConfigs = chartConfigs.filter((_, i) => i !== index);
        setChartConfigs(newConfigs);
    };

    const handleUpdateChart = (index, field, value) => {
        const newConfigs = [...chartConfigs];
        newConfigs[index][field] = value;
        setChartConfigs(newConfigs);
    };

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ flex: '1', padding: '10px' }}>
                <ChartForm language = {language} data={allData} onFormChange={handleFormChange} />
                <button onClick={() => window.print()}>{language === 'En' ? 'Print Charts' : 'إطبع الأشكال البيانية'}</button>
            </div>
            <div style={{ flex: '3', padding: '10px' }}>
                <ChartDisplay
                    chartConfigs={chartConfigs}
                    data={allData}
                    onDeleteChart={handleDeleteChart}
                    onUpdateChart={handleUpdateChart}
                    language = {language}
                />
            </div>
        </div>
    );
};

export default DashboardPage;