/*
Bechdel Scatter Plot

Standard Comparison of Budget and Gross

 */

 ////////////////////////////////////////////////SETUP/////////////////
 
 let Scatdataset;
 let Sw;
 let Sh;
 let SxScale, SyScale;
 let SxAxis, SyAxis;
 let SxAxisGroup, SyAxisGroup;
 let scatterChart;

 let SdataURL = 'movies-cleaned.csv';

 var scatterTip = d3.select('body').append('div')
    .attr("class", "scatterTip")				
    .style("opacity", 0);
 
 //Convert Rows
function ConvertRows(row) {
    return {
      year: parseInt(row.year),//parseDate(row.year),
      title: row.title,
      binary: row.binary,
      gross: parseInt(row.domgross),
      budget: parseInt(row.budget),
      net: parseInt(row.domgross - row.budget)
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
  
  
Sw = setWidth();
Sh = 470;

function buildScatter(Sdataset) {
    let netMin = d3.min(dataset, (d) => d.net);
    let netMax = d3.max(dataset, (d) => d.net);
    let budgMin = d3.min(dataset, (d) => d.budget);
    let budgMax = d3.max(dataset, (d) => d.budget);

    console.log('budgeMin: ' + budgMin);
    console.log('budgMax: ' + budgMax);
    console.log('grossMin: ' + netMin);
    console.log('grossMax: ' + netMax);

    //BUDGET ON X
    let SxScale = d3.scaleLinear()
                  .domain([budgMin, 170000000])
                  .rangeRound([20, w - 30]);

    //GROSS ON Y
    let SyScale = d3.scaleLinear()
                  .domain([netMin, netMax + 10000000])
                  .rangeRound([h - 20, 0]);

    scatterChart = d3.select('#bvg')
    .attr('width', Sw)
    .attr('height', Sh);

    scatterChart.selectAll('circle')
    .data(Sdataset)
    .enter()
    .append('circle')
    .attr('cx', (d) => SxScale(d.budget))
    .attr('cy', (d) => SyScale(d.net))
    .attr('fill', function(d) {
        if(d.binary == 'PASS'){
            return '#764f5a'
        } else {
            return '#92a5ee'
        }
    })
    .attr('r', 4)
    .attr('transform', `translate(35, -5)`)
    .on('mouseover', function(d, i) {
      d3.select(this)
        .transition()
      scatterTip.transition()		
        .duration(200)		
        .style("opacity", .9);
      scatterTip.html(
        'Movie: ' + d.title + '<br/>' +
        'Budget: $' + d3.format(",.2f")(d.budget) + '<br/>' +
        'Net: $' + d3.format(",.2f")(d.net)
      )	
        .style("left", (d3.event.pageX) + 10 + "px")		
        .style("top", (d3.event.pageY - 28) + "px");	
    })
    .on('mouseout', function(d, i) {
      d3.select(this)
        .transition()
      console.log("moused out in original");
      scatterTip.transition()		
        .duration(500)		
        .style("opacity", 0);
    });

    // let line = d3.select('#bvg').append()

    // scatterChart.append(line);

    // scatterChart
    // .on('mouseover', function(d, i) {
    //   d3.select(this)
    //     .transition()
    //     .style('fill', '#77ab59');
    //   toolTip.transition()		
    //     .duration(200)		
    //     .style("opacity", .9);
    //   toolTip.html(
    //     'Year: ' + d.key + '<br/>' +
    //     d3.format(".0%")(d.value.passed / d.value.all) + ' pass Bechdel'
    //   )	
    //     .style("left", (d3.event.pageX) + 10 + "px")		
    //     .style("top", (d3.event.pageY - 28) + "px");	
    // })
    // .on('mouseout', function(d, i) {
    //   d3.select(this)
    //     .transition()
    //     .style('fill', 'rosybrown');
    //   console.log("moused out in original");
    //   toolTip.transition()		
    //     .duration(500)		
    //     .style("opacity", 0);
    // });

    //AXES
    SxAxis = d3.axisBottom(SxScale)
    .tickFormat(d3.format(".2s"));
    SxAxisGroup = scatterChart.append('g')
    .attr('transform', `translate(30, ${h - 20})`)
    .call(SxAxis);

    SyAxis = d3.axisLeft(SyScale)
    .tickFormat(d3.format(".2s"));
    SyAxisGroup = scatterChart.append('g')
    .attr('transform', `translate(50, 0)`)
    .call(SyAxis);

    //axis labels
    //https://bl.ocks.org/d3noob/23e42c8f67210ac6c678db2cd07a747e
    // text label for the x axis
    scatterChart.append("text")             
    .attr("transform",
          "translate(" + (Sw/2) + " ," + 
                        (Sh - 5) + ")")
    .style("text-anchor", "middle")
    .text("Budget")
    .attr("class", "axis");

    // text label for the y axis
    scatterChart.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -2)
    .attr("x",0 - (Sh / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Gross - Budget")
    .attr("class", "axis");


}

function makeScatter() {
  d3.csv(dataURL, ConvertRows)
    .then((d) => {
      dataset = d;
      buildScatter(dataset);
    });  
}