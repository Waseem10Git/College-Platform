import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const ScatterPlot = ({ data, color }) => {
    const svgRef = useRef(null);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove(); // Clear previous render

        const margin = { top: 20, right: 30, bottom: 40, left: 40 };
        const width = 400 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.x)])
            .range([margin.left, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.y)])
            .range([height, margin.top]);

        svg.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(x));

        svg.append('g')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(y));

        svg.selectAll('.dot')
            .data(data)
            .enter().append('circle')
            .attr('class', 'dot')
            .attr('cx', d => x(d.x))
            .attr('cy', d => y(d.y))
            .attr('r', 5)
            .style('fill', color)
            .style('opacity', 0.7);
    }, [data, color]);

    return (
        <svg ref={svgRef} width="400" height="300">
            <text x="200" y="20" textAnchor="middle" fontSize="16px" fontWeight="bold">
                Scatter Plot
            </text>
        </svg>
    );
};

export default ScatterPlot;
