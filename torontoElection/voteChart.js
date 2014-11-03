    function voteChart() {
  
/* THE DATA */


      var OU = tickets['over/under'];

      
    var margin = {top: 0, right: 50, bottom: 40, left: 0},
        width = $("#voteChart").width() - margin.left - margin.right;

          var barHeight = 20;

          var barPadding = 0.3;

          var x = d3.scale.linear()
              .range([0, width-20]);

          var startMargin = 40;

          var xAxis = d3.svg.axis()
              .scale(x)
              .orient("top");

          function make_x_axis() {        
              return d3.svg.axis()
                  .scale(x)
                  .orient("bottom")
                  .ticks(5);
                }

          x.domain([0, d3.max(gameStats, function(d) { return parseInt(d.pass_yds); })]);

          var svg = d3.select("#voteChart")
            .append("svg")
              .attr("width", width + margin.left + margin.right)
            .attr("height", barHeight * gameStats.length + 50)
            .append("g")
            .attr("transform", function(d, i) { return "translate(10," + i * barHeight + ")"; });

          var height = barHeight * gameStats.length + 70;

          svg.append("g")         
            .attr("class", "grid")
            .attr("transform", "translate(40,0)")
            .call(make_x_axis()
            .tickSize(height - 38, 0, 0));


            
          var bars = svg.selectAll(".bar")
                .data(gameStats)
              .enter().append("rect")
              .attr("class", "bar")
              .attr("y", function(d,i) { return 25 + (i * 20); })
              .attr("height", barHeight - 1)
              .attr("x", startMargin)
              .attr("width",  function(d) {return x(parseInt(d.pass_yds)); })
              .style("fill", function(d) {
                  if (d.team == d.homeTeam) {return "#999"} 
                    else    { return "#666" }  
                  });

          var teamText =  svg.selectAll(".bartext5")
                .data(gameStats)
              .enter()
                .append("text")
                .attr("class", "bartext")
                .attr("x", function(d) { return 36 ;})
                .attr("y", function(d, i) { return  + (i * 20 + 38) ; })
                .style("text-anchor", "end")
                .style("fill", "white")
                .style("font-size", "80%");

          var axisText =  svg.selectAll(".miniBarText")
                .data(gameStats)
              .enter()
                .append("text")
                .attr("class", "miniBarText")
                .attr("x", 45)
                .attr("y", function(d, i) { return  + (i * 20 + 38) ; })
                .style("text-anchor", "start")
                .style("fill", "white")
                .style("font-size", "10px");

          var miniBars = svg.selectAll(".miniBar")
                .data(gameStats)
              .enter().append("rect")
              .attr("class", "miniBar")
              .attr("x", function(d) { return 40 ;})
              .attr("y", function(d,i) { return 25 + (i * 20); })
              .attr("height", barHeight - 1)
              .attr("width",  1)
              .style("fill", "white");

          var dataLabel = svg.selectAll(".bartext3")
                .data(gameStats)
              .enter()
                .append("text")
                .filter(function(d) {return d.date != ''})
                .attr("text-anchor", "end");

              dataLabel.attr("x", function(d) { return x(parseInt(d.pass_yds)) + 35; })
                .attr("y", function(d,i) { return i * 20 + 38 })
                .text(function(d){
                  if (d.pass_yds > 50) {return parseInt(d.pass_yds);}
                  else {return ""}
                })
                .style("fill", "black")
                .style("font-size", "10px");

            teamText.text(function(d){
                     if (d.team == d.awayTeam) { return "@" + d.homeTeam }  
                      if (d.team == d.homeTeam) { return d.awayTeam }
                });

            svg.select('.grid')
              .append("line")
              .attr("class","lineOU")
              .attr("x1", function(d) { return x(tickets['over/under']) ;})
              .attr("y1", function(d) { return 0 ; })
              .attr("x2", function(d) { return x(tickets['over/under'] )  ;})
              .attr("y2", function(d) { return barHeight * gameStats.length + 30 ; })
              .style("stroke-width", 2)
              .style("stroke-dasharray", ("4, 1"));

           svg.select(".grid")
              .append("text")
              .attr("text-anchor", "end")
              .attr("x", function(d) { return x(tickets['over/under']) - 5 ;})
              .attr("y", function(d) { return 12; })
              .text(function(d){
                   return OU ;
              });  

       
         };

