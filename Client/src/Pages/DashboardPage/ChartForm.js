import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const ChartForm = ({ data, onFormChange, language }) => {
    const [chartConfigs, setChartConfigs] = useState([{
        chartType: null,
        selectedX: null,
        selectedY: null,
        color: '#000000',
    }]);
    const [valueOptions, setValueOptions] = useState([]);

    useEffect(() => {
        if (data.length > 0) {
            const keys = Object.keys(data[0]);
            setValueOptions(keys.map(key => ({ value: key, label: key })));
        }
    }, [data]);

    const handleAddChart = () => {
        const newConfigs = [...chartConfigs, {
            chartType: null,
            selectedX: null,
            selectedY: null,
            color: '#000000',
        }];
        setChartConfigs(newConfigs);
        onFormChange(newConfigs);
    };

    const handleChange = (index, field, value) => {
        const newChartConfigs = [...chartConfigs];
        newChartConfigs[index][field] = value;
        setChartConfigs(newChartConfigs);
        onFormChange(newChartConfigs);
    };

    const handleDeleteChart = (index) => {
        const newChartConfigs = chartConfigs.filter((_, i) => i !== index);
        setChartConfigs(newChartConfigs);
        onFormChange(newChartConfigs);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {chartConfigs.map((config, index) => (
                <div key={index} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                    <div>
                        <label style={{ marginRight: '10px' }}>{language === 'En' ? 'Select Chart Type:' : 'إختر الشكل البياني'}</label>
                        <Select 
                            options={[
                                { value: 'bar', label: 'Bar Chart' },
                                { value: 'line', label: 'Line Chart' },
                                { value: 'pie', label: 'Pie Chart' },
                                { value: 'scatter', label: 'Scatter Plot' },
                            ]}
                            onChange={(value) => handleChange(index, 'chartType', value)}
                            value={config.chartType}
                            placeholder="Choose chart type"
                        />
                    </div>
                    {config.chartType && config.chartType.value !== 'pie' && (
                        <div>
                            <div>
                                <label style={{ marginRight: '10px' }}>{language === 'En' ? 'Select X axis:' : 'إختر قيمة المحور الأوفقي'}</label>
                                <Select 
                                    options={valueOptions}
                                    onChange={(value) => handleChange(index, 'selectedX', value)}
                                    value={config.selectedX}
                                    placeholder="Choose X axis"
                                />
                            </div>
                            <div>
                                <label style={{ marginRight: '10px' }}>{language === 'En' ? 'Select Y axis:' : 'إختر قيمة المحور العمودي'}</label>
                                <Select 
                                    options={valueOptions}
                                    onChange={(value) => handleChange(index, 'selectedY', value)}
                                    value={config.selectedY}
                                    placeholder="Choose Y axis"
                                />
                            </div>
                        </div>
                    )}
                    {config.chartType && config.chartType.value === 'pie' && (
                        <div>
                            <label style={{ marginRight: '10px' }}>{language === 'En' ? 'Select Value:' : ':إختر القيمة'}:</label>
                            <Select 
                                options={valueOptions}
                                onChange={(value) => handleChange(index, 'selectedY', value)}
                                value={config.selectedY}
                                placeholder="Choose value"
                            />
                        </div>
                    )}
                    <div>
                        <label style={{ marginRight: '10px' }}>{language === 'En' ? 'Select Color:' : 'إختر اللون'}</label>
                        <input 
                            type="color" 
                            value={config.color} 
                            onChange={(e) => handleChange(index, 'color', e.target.value)} 
                        />
                    </div>
                    <div>
                        <button type="button" onClick={() => handleDeleteChart(index)}>{language === 'En' ? 'Delete Chart' : 'إمسح الشكل البياني'}</button>
                    </div>
                </div>
            ))}
            <button type="button" onClick={handleAddChart}>{language === 'En' ? 'Add Another Chart' : 'أضف شكل بياني جديد'}</button>
        </div>
    );
};

export default ChartForm;
