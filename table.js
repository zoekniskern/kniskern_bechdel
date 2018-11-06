var tabulate = function (data,columns) {

    console.log(data);
    var table = d3.select('#dataTable').append('table')
      var thead = table.append('thead')
      var tbody = table.append('tbody')
  
      thead.append('tr')
        .selectAll('th')
          .data(columns)
          .enter()
        .append('th')
          .text(function (d) { return d })
  
      var rows = tbody.selectAll('tr')
          .data(data)
          .enter()
        .append('tr')
  
      var cells = rows.selectAll('td')
        .data(function(row) {
            return columns.map(function(column) {
                return row[column];
            });
        })
        .enter()
        .append("td")
            .text(function(d) { return d; });
  
    return table;
  }
  
  d3.csv('movies.csv',function (data) {
      var columns = ['year','imdb','title','test','clean_test','binary','budget','domgross','intgross','code','budget_2013$','domgross_2013$','intgross_2013$','period code','decade code']
    tabulate(data,columns)
  })