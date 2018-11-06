/*
Blechdel Bar Graph

Movies Per Year
Blechdel Passes Per Year
Average Budget Per Year

 */

 ////////////////////////////////////////////////SETUP/////////////////
const chartType = document.querySelector('#yearData');
const chartTitle = document.querySelector('#yearTitle');
const chartDescrip = document.querySelector('#yearDescrip');

let dataset;
let w;
let h;
let svg;
let xScale, yScale;
let xAxis, yAxis;
let xAxisGroup, yAxisGroup;
let yearChart;

let budget = false;

let dataURL = 'movies-cleaned.csv';

let parseDate = d3.timeParse("%Y");

let key = (d) => d.key;

var toolTip = d3.select('body').append('div')
    .attr("class", "tooltip")				
    .style("opacity", 0);

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
      return {
        passed: d3.sum(values, function(d) {
          return d.binary == 'PASS';
        }),
        all: values.length
      };
    })   
  .entries(dataset);
  console.log(valuesByYear)

  //GET SVG CHART
  yearChart = d3.select('#chart')
    .attr('width', w)
    .attr('height', h);

  // var toolTip = d3.select('body').append('div')
  //   .attr("class", "tooltip")				
  //   .style("opacity", 0);

  //xScale of Years
  xScale = d3.scaleLinear()
    .domain([d3.min(valuesByYear, (d) => d.key), 
    d3.max(valuesByYear, (d) => d.key)])
    .rangeRound([30, w]);

  //yScale of Movies
  yScale = d3.scaleLinear()
  // NEED TO FIGURE OUT HOW TO CALCULATE ALL YEARS
    .domain([0, d3.max(valuesByYear, (d) => d.value.all)])
    .range([h-30, 30]);

console.log(d3.max(valuesByYear, (d) => d.key));

  let barlen = ((w - 40) / valuesByYear.length) - 10;
  //CHART    
  yearChart.selectAll('rect')
  .data(valuesByYear)
  .enter()
  .append('rect')
  .attr('x', (d) => xScale(d.key))
  .attr('y', (d) => yScale(d.value.all))
  .attr('width', barlen)
  .attr('height', (d) => yScale(0) - yScale(d.value.all))
  .attr('fill', 'rosybrown')
  .on('mouseover', function(d, i) {
    d3.select(this)
      .transition()
      .style('fill', '#77ab59');
    toolTip.transition()		
      .duration(200)		
      .style("opacity", .9);
    toolTip.html(
      'Year: ' + d.key + '<br/>'
      //d3.format(".0%")(d.value.passed / d.value.all) + ' pass Blechdel'
    )	
      .style("left", (d3.event.pageX) + 10 + "px")		
      .style("top", (d3.event.pageY - 28) + "px");	
  })
  .on('mouseout', function(d, i) {
    d3.select(this)
      .transition()
      .style('fill', 'rosybrown');
    console.log("moused out in original");
    toolTip.transition()		
      .duration(500)		
      .style("opacity", 0);
  });

  //AXES
  xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.format("d"));
  xAxisGroup = yearChart.append('g')
    .attr('transform', `translate(0, ${h - 27})`)
    .call(xAxis);

  yAxis = d3.axisLeft(yScale);
  yAxisGroup = yearChart.append('g')
    .attr('transform', `translate(30, 0)`)
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
      return {
        passed: d3.sum(values, function(d) {
          return d.binary == 'PASS';
        }),
        all: values.length
      };
    })   
  .entries(dataset);
  //console.log(passByYear)

  //yScale of Passes
  yScale.domain([0, d3.max(passByYear, (d) => d.value.all)]);

  let barlen = ((w - 40) / passByYear.length) - 10;
  let bars = yearChart.selectAll('rect').data(passByYear, key);

  bars 
    .enter()
      .append()
      .attr('x', (d) => xScale(d.key))
      .attr('y', (d) => yScale(d.value.passed))
      .attr('width', barlen)
      .attr('height', (d) => yScale(0) - yScale(d.value.passed))
      .on('mouseover', function(d, i) {
        d3.select(this)
          .transition()
          .style('fill', '#7F525D');
        toolTip.transition()		
          .duration(200)		
          .style("opacity", .9);
        toolTip.html(
          'Year: ' + d.key + '<br/>'
          //'Pass Blechdel: ' + d3.format(".0%")(d.value.passed / d.value.all)
        )	
          .style("left", (d3.event.pageX) + 10 + "px")		
          .style("top", (d3.event.pageY - 28) + "px");	
      })
      .on('mouseout', function(d, i) {
        d3.select(this)
          .transition()
          .style('fill', 'rosybrown');
        console.log("moused out");
        toolTip.transition()		
          .duration(500)		
          .style("opacity", 0);
      })
    .merge(bars)
      .transition('switch')
      .duration(500)
      .attr('y', (d) => yScale(d.value.passed))
      .attr('height', (d) => yScale(0) - yScale(d.value.passed));

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
      return {
        passed: d3.sum(values, function(d) {
          return d.binary == 'PASS';
        }),
        all: values.length
      };
    })   
  .entries(dataset);
  //console.log(valuesByYear)

  //yScale of Passes
  yScale.domain([0, d3.max(valuesByYear, (d) => d.value.all)]);

  let barlen = ((w - 40) / valuesByYear.length) - 10;
  let bars = yearChart.selectAll('rect').data(valuesByYear, key);

  bars 
    .enter()
      .append()
      .attr('x', (d) => xScale(d.key))
      .attr('y', (d) => yScale(d.value.all))
      .attr('width', barlen)
      .attr('height', (d) => yScale(0) - yScale(d.value.all))
      .on('mouseover', function(d, i) {
        d3.select(this)
          .transition()
          .style('fill', '#7F525D');
        toolTip.transition()		
          .duration(200)		
          .style("opacity", .9);
        toolTip.html(
          'Year: ' + d.key + '<br/>' +
          'Pass Blechdel: ' + d3.format(".0%")(d.value.passed / d.value.all)
        )	
          .style("left", (d3.event.pageX) + 10 + "px")		
          .style("top", (d3.event.pageY - 28) + "px");	
      })
      .on('mouseout', function(d, i) {
        d3.select(this)
          .transition()
          .style('fill', 'rosybrown');
        console.log("moused out");
        toolTip.transition()		
          .duration(500)		
          .style("opacity", 0);
      })
    .merge(bars)
      .transition('switch')
      .duration(500)
      .attr('y', (d) => yScale(d.value.all))
      .attr('height', (d) => yScale(0) - yScale(d.value.all));

  yAxisGroup.transition().call(yAxis);
}

////////////////////////////////////////////////AVERAGE BUDGET/YEAR/////////////////
function BudgPerYear(dataset){
  //Sorted by Year
  var budgetByYear;
  budgetByYear = d3.nest()
    .key( function(d) {
      return d.year;
    }) 
    .rollup( function(values) { 
      return d3.mean(values, function(d) { return d.budget; }); 
      }
    )   
  .entries(dataset);
  //console.log(budgetByYear)

  //yScale of Budget
  yScale.domain([0, d3.max(budgetByYear, (d) => d.value)]);

  let barlen = ((w - 40) / budgetByYear.length) - 10;
  let bars = yearChart.selectAll('rect').data(budgetByYear, key);

  console.log('I ran inside budget');

  bars 
    .enter()
      .append()
      .attr('x', (d) => xScale(d.key))
      .attr('y', (d) => yScale(d.value))
      .attr('width', barlen)
      .attr('height', (d) => yScale(0) - yScale(d.value))
      .on('mouseover', function(d, i) {
        d3.select(this)
          .transition()
          .style('fill', '#7F525D');
        toolTip.transition()		
          .duration(200)		
          .style("opacity", .9);
        toolTip.html(
          'Average Budget: ' + d3.format(".2s")(d.value)
        )	
          .style("left", (d3.event.pageX) + 10 + "px")		
          .style("top", (d3.event.pageY - 28) + "px");	
      })
      .on('mouseout', function(d, i) {
        d3.select(this)
          .transition()
          .style('fill', 'rosybrown');
        console.log("moused out");
        toolTip.transition()		
          .duration(500)		
          .style("opacity", 0);
      })
    .merge(bars)
      .transition('switch')
      .duration(500)
      .attr('y', (d) => yScale(d.value))
      .attr('height', (d) => yScale(0) - yScale(d.value));

  yAxis.tickFormat(d3.format(".2s"));
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
      chartTitle.textContent = 'Looking at Movies by Year';
      chartDescrip.textContent = 'This set of data contains 1795 movies but they are not equally distributed by year. As we examine trends by year it is important to recognize flaws in our dataset that weigh it heavily towards movies in the 2000s.';
      budget = false;
      console.log('ran movies per year update');
      break;
    case 1:
      //Blechdel
      PassPerYear(dataset);
      chartTitle.textContent = 'How Many Movies Passed the Blechdel Test';
      chartDescrip.textContent = 'Out of the movies from each year included in our dataset, this is how many passed.';
      budget = false;
      console.log('ran passes per year update');
      break;
    case 2:
      //Budget
      BudgPerYear(dataset);
      chartTitle.textContent = 'The Average Budget of Films by Year';
      chartDescrip.textContent = 'It is important to note how much the budgets for movies have increased overthe years. In millions, this is the average budget for the movies of each year in this dataset.';
      budget = true;
      console.log('ran average budget per year update');
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

  makeScatter();

  chartType.addEventListener("change", updateGraph);
}
