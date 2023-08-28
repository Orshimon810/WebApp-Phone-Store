
const token = localStorage.getItem('token'); // Replace with your actual token


$.ajax({
    url: "http://localhost:3000/api/v1/orders",
    type: "GET",
    headers: {
        Authorization: `Bearer ${token}`
    },
    success: function(data) {
        createChart(data);
    },
    error: function(error) {
        console.error('Error fetching data:', error);
    }
});
$.ajax({
    url: "http://localhost:3000/api/v1/products",
    type: "GET",
    headers: {
        Authorization: `Bearer ${token}`
    },
    success: function(data) {
        createPieChart(data);
    },
    error: function(error) {
        console.error('Error fetching data:', error);
    }
});

function createChart(data) {
    const orders = data; // Assuming data is an array of orders
    const svgWidth = 600;
    const svgHeight = 400;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    const svg = d3.select("#chart1")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Group orders by date and calculate the sum of prices for each date
    const ordersByDate = d3.group(orders, order => order.dateOrdered.slice(0, 10));
    const sumOfPricesByDate = Array.from(ordersByDate, ([date, orders]) => ({
        date,
        totalPrice: d3.sum(orders, order => order.totalPrice)
    }));
    
    // Extract date and total price for visualization
    const dates = sumOfPricesByDate.map(entry => entry.date);
    const totalPrices = sumOfPricesByDate.map(entry => entry.totalPrice);



    const yScale = d3.scaleLinear()
        .domain([0, d3.max(totalPrices)])
        .nice()
        .range([chartHeight, 0]);

        const xScale = d3.scaleBand()
        .domain(dates)
        .range([0, chartWidth])
        .paddingInner(0.2) // Adjust this value to change the spacing between bars
        .paddingOuter(0.1);
    
    // Adjust the x position and width of the bars
    chart.selectAll(".bar")
        .data(totalPrices)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => xScale(dates[i]))
        .attr("y", d => yScale(d))
        .attr("width", xScale.bandwidth())
        .attr("height", d => chartHeight - yScale(d))
        .style("fill", "blue");


        chart.append("g")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-0.8em")
        .attr("dy", "0.15em")
        .attr("transform", "rotate(-45)");

    chart.append("g")
        .call(d3.axisLeft(yScale));
}

function createPieChart(data) {
const products = data; // Assuming data is an array of products

const svgWidth = 700;
const svgHeight = 400;
const radius = Math.min(svgWidth, svgHeight) / 2;

const svg = d3.select("#pieChart")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight);

const chart = svg.append("g")
.attr("transform", `translate(${svgWidth / 2},${svgHeight / 2})`);

const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

const pie = d3.pie()
.value(d => d.countInStock)
.sort(null);

const arc = d3.arc()
.innerRadius(0)
.outerRadius(radius);

const arcs = chart.selectAll(".arc")
.data(pie(products))
.enter()
.append("g")
.attr("class", "arc");

arcs.append("path")
.attr("d", arc)
.attr("fill", (_, i) => colorScale(i))
.attr("stroke", "white")
.attr("stroke-width", 2);

const labelArc = d3.arc()
.innerRadius(radius * 0.7)
.outerRadius(radius * 0.7);

arcs.append("text")
.attr("transform", d => `translate(${labelArc.centroid(d)})`)
.attr("dy", "0.35em")
.text(d => d.data.countInStock)
.style("text-anchor", "middle")
.style("font-size", "20px")
.style("font-weight", "bold");

const legend = svg.selectAll(".legend")
.data(colorScale.domain())
.enter()
.append("g")
.attr("class", "legend")
.attr("transform", (d, i) => `translate(0,${i * 20+90})`);

legend.append("rect")
.attr("x", svgWidth - 18)
.attr("width", 18)
.attr("height", 18)
.attr("fill", colorScale);

legend.append("text")
.attr("x", svgWidth - 24)
.attr("y", 9)
.attr("dy", ".35em")
.style("text-anchor", "end")
.text(d => products[d].name);
}

