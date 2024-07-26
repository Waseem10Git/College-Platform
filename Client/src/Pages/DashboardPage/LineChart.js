import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const LineChart = ({ data, color }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        // Clear previous chart
        d3.select(chartRef.current).selectAll("*").remove();

        const svg = d3.select(chartRef.current)
            .attr("width", 500)
            .attr("height", 300);

        const margin = { top: 20, right: 30, bottom: 40, left: 40 };
        const width = +svg.attr("width") - margin.left - margin.right;
        const height = +svg.attr("height") - margin.top - margin.bottom;

        const x = d3.scaleTime()
            .domain(d3.extent(data, d => new Date(d.x)))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.y)]).nice()
            .range([height, 0]);

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        g.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        g.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y));

        const line = d3.line()
            .x(d => x(new Date(d.x)))
            .y(d => y(d.y))
            .curve(d3.curveMonotoneX);

        g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", 1.5)
            .attr("d", line);
    }, [data, color]);

    return <svg ref={chartRef}></svg>;
};

export default LineChart;
