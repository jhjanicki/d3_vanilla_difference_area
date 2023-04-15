const scaleFactor = 1.8;

let width = 1920 / scaleFactor;
let height = 1080 / scaleFactor;

const margin = {
    "top": 84 / scaleFactor,
    "left": (70 + 84) / scaleFactor,
    "bottom": (85 + 84) / scaleFactor,
    "right": 84 / scaleFactor
}


const china = data.filter(d => d.country === "China");
const india = data.filter(d => d.country === "India")

const newData = china.map(d=>{
    const indiaCurrYear = india.find(d2=>d2.year===d.year);
    const indiaPopulation = indiaCurrYear.population;
    return {
        year:d.year,
        low: d.population < indiaPopulation? d.population:indiaPopulation,
        high:d.population > indiaPopulation? d.population:indiaPopulation,
        more: d.population < indiaPopulation?"india":"china"
    }
})


const minDate = data[0].year;
const maxDate = data[data.length - 1].year;


const xScale = d3.scaleLinear()
    .domain([minDate, maxDate])
    .range([0, width - margin.left - margin.right])

const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.population)])
    .range([height - margin.bottom, 0]);


let xAxis = d3.axisBottom(xScale).ticks(20).tickFormat(d=>d)
let yAxis = d3.axisLeft(yScale).ticks(10);


const areaGeneratorDiff = d3.area()
    .x(d=>xScale(d.year))
    .y0(d=>yScale(d.low))
    .y1(d=>yScale(d.high))

 const lineGenerator = d3.line()
    .x(d=>xScale(d.year))
    .y(d=>yScale(d.population))

//svg
const svg = d3.select("#chart").append("svg").attr("width", width).attr("height", height);

const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

g.append("g")
    .attr("class", "y-axis")
    .call(yAxis);

g.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis);

g.append("clipPath")
    .attr("id", "before")
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", xScale(2024))
    .attr("height", yScale(0));

g.append("clipPath")
    .attr("id", "after")
    .append("rect")
    .attr("x", xScale(2024))
    .attr("y", 0)
    .attr("width", xScale(2100))
    .attr("height", yScale(0));

g.append("path")
    .datum(newData)
    .attr("fill", "#e78ac3")
    .attr("opacity",0.5)
    .attr("d", areaGeneratorDiff)
    .attr("clip-path", "url(#before)");

g.append("path")
    .datum(newData)
    .attr("fill", "#80b1d3")
    .attr("opacity",0.5)
    .attr("d", areaGeneratorDiff)
    .attr("clip-path", "url(#after)");

g.append("path")
    .datum(india)
    .attr("fill", "none")
    .attr("stroke","#386cb0")
    .attr("stroke-width",2)
    .attr("d", lineGenerator)

g.append("path")
    .datum(china)
    .attr("fill", "none")
    .attr("stroke","#f0027f")
    .attr("stroke-width",2)
    .attr("d", lineGenerator)

//add annotations
g.append("line")
    .attr("x2",xScale(1980))
    .attr("x1",xScale(1980))
    .attr("y2",yScale(800000000))
    .attr("y1",yScale(400000000))
    .attr("fill", "none")
    .attr("stroke","black")
    .attr("stroke-width",1.5);

g.append("line")
    .attr("x2",xScale(2070))
    .attr("x1",xScale(2070))
    .attr("y2",yScale(1400000000))
    .attr("y1",yScale(800000000))
    .attr("fill", "none")
    .attr("stroke","black")
    .attr("stroke-width",1.5);

g.append("text")
    .attr("x",xScale(1980))
    .attr("y",yScale(300000000))
    .attr("fill","black")
    .attr("text-anchor","middle")
    .text("China has more people")

g.append("text")
    .attr("x",xScale(2070))
    .attr("y",yScale(700000000))
    .attr("fill","black")
    .attr("text-anchor","middle")
    .text("India has more people")

g.append("text")
    .attr("x",xScale(2100))
    .attr("y",yScale(1600000000))
    .attr("fill","#386cb0")
    .attr("text-anchor","end")
    .text("India")

g.append("text")
    .attr("x",xScale(2100))
    .attr("y",yScale(720000000))
    .attr("fill","#f0027f")
    .attr("text-anchor","end")
    .text("China")