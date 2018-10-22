/*
Blechdel Progress

Movies Per Year
Bar Graph

Average Budget per Movie X Year
ScatterPlot (Lines between)

Number of Blechdel Test Passes Per Year
Bar Graph

 */

 ////////////////////////////////////////////////SETUP/////////////////
const chartType = document.querySelector('#yearData');

let dataset;
let w;
let h;
let svg;
let xScale, yScale;
let xAxis, yAxis;
let xAxisGroup, yAxisGroup;
let yearChart;

let numDaysSlider = document.querySelector("#numDaysSlider");

let dataURL = 'movies.csv';

let parseDate = d3.timeParse("%Y");

let key = (d) => d.key;

//Convert Rows
function ConvertRows(row) {
  return {
    year: parseInt(row.year),//parseDate(row.year),
    title: row.title,
    binary: row.binary,
    budget: parseFloat(row.budget),
    
  }
}

//Setting the width of the chart
function setWidth() {
  let width = 400;
      if(window.innerWidth > 768) {
        width = window.innerWidth * .75;
      } else {
        width = window.innerWidth - 60;
      }
  return width;
}


w = setWidth();
h = 450;


////////////////////////////////////////////////INIT GRAPH/////////////////
function makeMoviesPerYear(dataset) {
  //Sorted by Year
  var valuesByYear;
  valuesByYear = d3.nest()
    .key( function(d) {
      return d.year;
    }) 
    .rollup( function(values) {
      return values.length
    })   
  .entries(dataset);
  console.log(valuesByYear)

  //GET SVG CHART
  yearChart = d3.select('#chart')
    .attr('width', w)
    .attr('height', h);

  //xScale of Years
  xScale = d3.scaleLinear()
    .domain([d3.min(valuesByYear, (d) => d.key), 
    d3.max(valuesByYear, (d) => d.key)])
    .rangeRound([30, w]);

  //yScale of Movies
  yScale = d3.scaleLinear()
  // NEED TO FIGURE OUT HOW TO CALCULATE ALL YEARS
    .domain([0, d3.max(valuesByYear, (d) => d.value)])
    .range([h-30, 30]);

console.log(d3.max(valuesByYear, (d) => d.key));

  let barlen = (w / dataset.length) + 1;
  //CHART    
  yearChart.selectAll('rect')
  .data(valuesByYear)
  .enter()
  .append('rect')
  .attr('x', (d) => xScale(d.key))
  .attr('y', (d) => yScale(d.value))
  .attr('width', 5)
  .attr('height', (d) => yScale(0) - yScale(d.value))
  .attr('fill', 'rosybrown');

  //AXES
  xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.format("d"));
  xAxisGroup = yearChart.append('g')
    .attr('transform', `translate(0, ${h - 27})`)
    .call(xAxis);

  yAxis = d3.axisLeft(yScale);
  yAxisGroup = yearChart.append('g')
    .attr('transform', `translate(25, 0)`)
    .call(yAxis);
}

////////////////////////////////////////////////PASS PER YEAR/////////////////
function PassPerYear(dataset){
  //Sorted by Year
  var passByYear;
  passByYear = d3.nest()
    .key( function(d) {
      return d.year;
    }) 
    .rollup( function(values) {
      return d3.sum(values, function(d) {
        return d.binary == 'PASS';
      })
    })   
  .entries(dataset);
  console.log(passByYear)

  //yScale of Passes
  yScale.domain([0, d3.max(passByYear, (d) => d.value)]);

  let bars = yearChart.selectAll('rect').data(passByYear, key);

  bars 
    .enter()
      .append()
      .attr('x', (d) => xScale(d.key))
      .attr('y', (d) => yScale(d.value))
      .attr('width', 5)
      .attr('height', (d) => yScale(0) - yScale(d.value))
    .merge(bars)
      .transition('switch')
      .duration(500)
      .attr('y', (d) => yScale(d.value))
      .attr('height', (d) => yScale(0) - yScale(d.value));

  yAxisGroup.transition().call(yAxis);
}

////////////////////////////////////////////////MOVIES PER YEAR/////////////////
function MovPerYear(dataset){
  //Sorted by Year
  var valuesByYear;
  valuesByYear = d3.nest()
    .key( function(d) {
      return d.year;
    }) 
    .rollup( function(values) {
      return values.length
    })   
  .entries(dataset);
  console.log(valuesByYear)

  //yScale of Passes
  yScale.domain([0, d3.max(valuesByYear, (d) => d.value)]);

  let bars = yearChart.selectAll('rect').data(valuesByYear, key);

  bars 
    .enter()
      .append()
      .attr('x', (d) => xScale(d.key))
      .attr('y', (d) => yScale(d.value))
      .attr('width', 5)
      .attr('height', (d) => yScale(0) - yScale(d.value))
    .merge(bars)
      .transition('switch')
      .duration(500)
      .attr('y', (d) => yScale(d.value))
      .attr('height', (d) => yScale(0) - yScale(d.value));

  yAxisGroup.transition().call(yAxis);
}

////////////////////////////////////////////////AVERAGE BUDGET/YEAR/////////////////
function MovPerYear(dataset){
  //Sorted by Year
  var valuesByYear;
  valuesByYear = d3.nest()
    .key( function(d) {
      return d.year;
    }) 
    .rollup( function(values) {
      return values.length
    })   
  .entries(dataset);
  console.log(valuesByYear)

  //yScale of Passes
  yScale.domain([0, d3.max(valuesByYear, (d) => d.value)]);

  let bars = yearChart.selectAll('rect').data(valuesByYear, key);

  bars 
    .enter()
      .append()
      .attr('x', (d) => xScale(d.key))
      .attr('y', (d) => yScale(d.value))
      .attr('width', 5)
      .attr('height', (d) => yScale(0) - yScale(d.value))
    .merge(bars)
      .transition('switch')
      .duration(500)
      .attr('y', (d) => yScale(d.value))
      .attr('height', (d) => yScale(0) - yScale(d.value));

  yAxisGroup.transition().call(yAxis);
}

////////////////////////////////////////////////UPDATE GRAPH/////////////////
function updateGraph() {
  console.log(chartType.value);
  console.log(chartType.selectedIndex);

  switch(chartType.selectedIndex){
    case 0:
      //Movies
      MovPerYear(dataset);
      console.log('ran movies per year update');
      break;
    case 1:
      //Blechdel
      PassPerYear(dataset);
      console.log('ran passes per year update');
      break;
    default:
      break;
  }
}

////////////////////////////////////////////////ONLOAD FUNC/////////////////
window.onload = function() {
  d3.csv(dataURL, ConvertRows)
    .then((d) => {
      dataset = d;
      makeMoviesPerYear(dataset);
    });  

  chartType.addEventListener("change", updateGraph);
}
