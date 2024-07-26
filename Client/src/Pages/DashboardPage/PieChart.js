import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const PieChart = ({ data }) => {
    const ref = useRef();

    useEffect(() => {
        const svg = d3.select(ref.current);
        svg.selectAll('*').remove(); // Clear previous render

        const width = 300;
        const height = 300;
        const radius = Math.min(width, height) / 2;

        const color = d3.scaleOrdinal(d3.schemeCategory10);
        const arc = d3.arc().innerRadius(0).outerRadius(radius);
        const pie = d3.pie().value(d => d.value);

        svg
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`)
            .selectAll('path')
            .data(pie(data))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', (d, i) => color(i));
    }, [data]);

    return <svg ref={ref} />;
};

export default PieChart;
