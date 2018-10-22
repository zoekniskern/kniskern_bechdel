/*
Blechdel Scatter Plot

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
 
 //Convert Rows
function ConvertRows(row) {
    return {
      year: parseInt(row.year),//parseDate(row.year),
      title: row.title,
      binary: row.binary,
      gross: parseInt(row.domgross),
      budget: parseInt(row.budget),
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
Sh = 450;

function buildScatter(Sdataset) {
    let budgMin = d3.min(dataset, (d) => d.gross);
    let budgMax = d3.max(dataset, (d) => d.gross);
    let grossMin = d3.min(dataset, (d) => d.budget);
    let grossMax = d3.max(dataset, (d) => d.budget);

    console.log('budgeMin: ' + budgMin);
    console.log('budgMax: ' + budgMax);
    console.log('grossMin: ' + grossMin);
    console.log('grossMax: ' + grossMax);

    //BUDGET ON X
    let SxScale = d3.scaleLinear()
                  .domain([budgMin, 170000000])
                  .rangeRound([20, w - 20]);

    //GROSS ON Y
    let SyScale = d3.scaleLinear()
                  .domain([grossMin, grossMax + 10000000])
                  .rangeRound([h - 20, 0]);

    scatterChart = d3.select('#bvg')
    .attr('width', Sw)
    .attr('height', Sh);

    scatterChart.selectAll('circle')
    .data(Sdataset)
    .enter()
    .append('circle')
    .attr('cx', (d) => SxScale(d.budget))
    .attr('cy', (d) => SyScale(d.gross))
    .attr('fill', function(d) {
        if(d.binary == 'PASS'){
            return '#77ab59'
        } else {
            return '#946471'
        }
    })
    .attr('r', 5)
    .attr('transform', `translate(35, -5)`);

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


}

function makeScatter() {
  d3.csv(dataURL, ConvertRows)
    .then((d) => {
      dataset = d;
      buildScatter(dataset);
    });  
}