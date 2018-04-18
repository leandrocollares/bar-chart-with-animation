const margin = { top: 40, right: 100, bottom: 40, left: 100 },
      width = 700 - margin.left - margin.right,
      height = 350 - margin.top - margin.bottom;

const svg = d3.select('#chart').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);    

const wrapper = svg.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');           
     
const xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1),
      yScale = d3.scaleLinear().rangeRound([height, 0]);
              
d3.csv('data/educationData.csv').then(data => {

  data.forEach(d => {
    d.percentage = +d.percentage;
  });

  data = data.sort((a, b) => b['percentage'] - a['percentage']);

  xScale.domain(data.map(d => d.country));
  yScale.domain([0, d3.max(data, d => d.percentage)]);

  const xAxis = wrapper.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(xScale));

  const bars = wrapper.append('g'),
        labels = wrapper.append('g');

  bars.selectAll('rect')
      .data(data)
    .enter().append('rect')
      .attr('x', d => xScale(d.country))
      .attr('width', xScale.bandwidth())
      .attr('y', height)
      .attr('height', 0)
      .style('fill', '#01665e')
      .transition()
      .duration(750)
      .attr('y', d => yScale(d.percentage))
      .attr('height', d => height - yScale(d.percentage))    

  labels.selectAll('text')
      .data(data)
    .enter().append('text')
      .attr('class', 'bar-label')
      .attr("x", d => xScale(d.country) + xScale.bandwidth()/2 )
      .attr("y", d => yScale(d.percentage) - 5)
      .attr('text-anchor','middle')
      .style('fill', '#333333')
      .text(d => d3.format(".1f")(d.percentage) + '%')
      .style('opacity', 0)
      .transition()
      .delay(750)
      .duration(750)
      .style('opacity', 1)            
});