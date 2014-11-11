    $(function () {

      //SETUP GOOGLE LAYER
      var $map=$("#map");
      var map = new google.maps.Map($map[0], {
          zoom: 11,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          center: new google.maps.LatLng(43.7125, -79.2667), // Toronto
          styles: [{featureType:"landscape",stylers:[{saturation:-100},{lightness:65},{visibility:"on"}]},{featureType:"poi",stylers:[{saturation:-100},{lightness:51},{visibility:"simplified"}]},{featureType:"road.highway",stylers:[{saturation:-100},{visibility:"simplified"}]},{featureType:"road.arterial",stylers:[{saturation:-100},{lightness:30},{visibility:"on"}]},{featureType:"road.local",stylers:[{saturation:-100},{lightness:40},{visibility:"on"}]},{featureType:"transit",stylers:[{saturation:-100},{visibility:"simplified"}]},{featureType:"administrative.province",stylers:[{visibility:"off"}]/**/},{featureType:"administrative.locality",stylers:[{visibility:"off"}]},{featureType:"administrative.neighborhood",stylers:[{visibility:"on"}]/**/},{featureType:"water",elementType:"labels",stylers:[{visibility:"on"},{lightness:-25},{saturation:-100}]},{featureType:"water",elementType:"geometry",stylers:[{hue:"#ffff00"},{lightness:-25},{saturation:-97}]}]        
        });
        
      //LOAD DATA
      var geoJson = subdivisions();
      var geoJsonWards = wards();
      
      //CALCULATE WARD VOTES
      var wardVotes = d3.nest()
      .key(function(d) { return d.properties.WARD;})
      .rollup(function(d) { return {
        "toryVotes": d3.sum(d, function(g) {return g.properties.TORYJOHN;}),
        "chowVotes": d3.sum(d, function(g) {return g.properties.CHOWOLIVIA;}), 
        "fordVotes": d3.sum(d, function(g) {return g.properties.FORDDOUG;}),
        "totalVotes": d3.sum(d, function(g) {return g.properties.TotalVotes;}),
        "zero": 0
      }})
      .entries(geoJson.features);

      //CALCULATE CITY WIDE VOTES
      var cityVotes = d3.nest()
      .rollup(function(d) { return {
        "toryVotes": d3.sum(d, function(g) {return g.properties.TORYJOHN;}),
        "chowVotes": d3.sum(d, function(g) {return g.properties.CHOWOLIVIA;}), 
        "fordVotes": d3.sum(d, function(g) {return g.properties.FORDDOUG;}),
        "totalVotes": d3.sum(d, function(g) {return g.properties.TotalVotes;}),
        "zero": 0
      }})
      .entries(geoJson.features);

      console.log(cityVotes);
                 
      //OVERLAY SVG LAYER
      var overlay = new google.maps.OverlayView();

      overlay.onAdd = function () {

        var layer = d3.select(this.getPanes().overlayMouseTarget).append("div").attr("class", "SvgOverlay");
        var svg = layer.append("svg")
          .attr("width", $map.width())
          .attr("height", $map.height())
        var adminDivisions = svg.append("g").attr("class", "divisions");
        var wardDivisions = svg.append("g").attr("class", "wards");

     //LEGEND
      var data = ['',40,50,60,70,80];

      var legendRow = function(color,top,candidate,dat){
      var legend = d3.select("#legendColors").append("svg")
        .attr("class", "legend")
        .attr("width", 240)
        .attr("height",100);
      
      var legendGroup = legend.attr("height", 25)
        .attr('x',0)
        .attr('y',top)
        .selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("transform", function(d, i) { return "translate("+ i * 34 + ",0)"; });

      legendGroup.append("rect")
        .attr('x',8)
        .attr("width", 33)
        .attr("height", 15)
        .style("fill", color)
        .style('opacity', function(d, i) { return i * 0.2 ; });

      legendGroup.append("text")
        .attr('class', function(d,i) {
          return "mayor_" + candidate
        })
        .attr("x", 8)
        .attr("y", 20)
        .attr("dy", ".35em")
        .style('font-size',10)
        .text(function(d,i) { return d; });

      legend.append("text")
        .attr("x", 0)
        .attr("y", 10)
        .attr("dy", ".35em")
        .style('font-size',12)
        .text(candidate);
      }

       legendRow('#003399',0,'Tory');
       legendRow('#990000',16,'Ford');
       legendRow('#6600FF',32,'Chow');


       var bar = d3.select(".subdivisionChart");
       var bar2 = d3.select(".voteChart");
       var bar3 = d3.select(".cityChart");

        
        //CHART WIDTH DOMAIN AND RANGE
        var x = d3.scale.linear()
            .domain([0, 100])
            .range([0, 222]);

          var xAxis = d3.svg.axis().scale(x).orient('bottom').ticks(5);

            bar.append('g')
            .attr("class", "axis")
            .attr('transform', 'translate(0,25)')
            .call(xAxis);

            d3.selectAll('.axis text')
              .attr('transform','translate(5,0)')

        overlay.draw = function () {
          var markerOverlay = this;
          var overlayProjection = markerOverlay.getProjection();

          // Turn the overlay projection into a d3 projection
          var googleMapProjection = function (coordinates) {
            var googleCoordinates = new google.maps.LatLng(coordinates[1], coordinates[0]);
            var pixelCoordinates = overlayProjection.fromLatLngToDivPixel(googleCoordinates);
            return [pixelCoordinates.x + 4000, pixelCoordinates.y + 4000];
          }
            
          //SIDEBAR
            var sideBar = function(d){
              
              var title = d3.select('div.title').append('text')
              .attr('class','title')
              .text(function() {return d.properties.WARD});

              var ward = d3.select('div.ward').append('text')
              .attr('class','ward')
              .text(function() {return d.properties.SUBDIVISIO});

              //DECIMAL FORMATTING
              var decimal = d3.format(".3n");
                  
                  var bars = function(data,name,color,width1,width2) {
                    bar.append("rect")
                    .attr('class','bar')
                        .attr("width", function() { return x(data * 100) ; })
                        .attr("height", 20)
                        .attr("x", function() { return  x((width1 + width2) * 100); })
                        .attr("y", 5)
                        .attr("dy", ".35em")
                        .style('fill', color);

                    bar.append("text")
                    .attr('class','bar')
                        .attr("x", function() { return x((width1 + width2) * 100) + 25; })
                        .attr("y", 13)
                        .attr("dy", ".35em")
                        .style('fill','#fff')
                        .text(function() { return decimal(data * 100); }); 
                      }
                      
                      bars(d.properties.Tory_perc,'Tory','#003399',0,0);
                      bars(d.properties.Ford_perc,'Ford','#990000',d.properties.Tory_perc,0);
                      bars(d.properties.Chow_perc,'Chow','#6600FF',d.properties.Tory_perc,d.properties.Ford_perc);


                     //WARD RESULTS
                     var wardBars = function(data,color,width1,width2) {
                      bar2.append("rect")
                        .attr('class','bar')
                        .attr("width", function() {
                          for (var i = 0; i < wardVotes.length; i++) { 
                            if (d.properties.WARD == wardVotes[i].key) {
                              var total = wardVotes[i].values["totalVotes"];
                          return x((wardVotes[i].values[data] / total)* 100)
                        }}})
                        .attr("height", 20)
                        .attr("x", function() { 
                          for (var i = 0; i < wardVotes.length; i++) { 
                            if (d.properties.WARD == wardVotes[i].key) {
                              var total = wardVotes[i].values["totalVotes"];
                              return  x((wardVotes[i].values[width1]/total)*100 + (wardVotes[i].values[width2]/total)*100); }}})
                        .attr("y", 5)
                        .style('fill', color);

                      bar2.append("text")
                      .attr('class','bar')
                        .attr("x", function() { 
                          for (var i = 0; i < wardVotes.length; i++) { 
                            if (d.properties.WARD == wardVotes[i].key) {
                              var total = wardVotes[i].values["totalVotes"];
                              return  x((wardVotes[i].values[width1]/total)*100 + (wardVotes[i].values[width2]/total)*100) + 25; }}})
                          .attr("y", 13)
                          .attr("dy", ".35em")
                          .style('fill','#fff')
                          .text(function() { 
                            for (var i = 0; i < wardVotes.length; i++) { 
                            if (d.properties.WARD == wardVotes[i].key) {
                              var total = wardVotes[i].values["totalVotes"];
                              return decimal(wardVotes[i].values[data] / total * 100)
                            }}}

                         ); 

                      }

                      wardBars("toryVotes",'#003399',"zero","zero");
                      wardBars("fordVotes",'#990000',"toryVotes","zero");
                      wardBars("chowVotes",'#6600FF',"toryVotes","fordVotes");

                     //WARD RESULTS
                     var cityBars = function(data,color,width1,width2) {
                      bar3.append('rect')
                        .attr('class','bar')
                        .attr("width", function() {
                          return x((cityVotes[data] / cityVotes["totalVotes"]) * 100)
                        })
                        .attr("height", 20)
                        .attr("x", function() { 
                              return  x(((cityVotes[width1]/cityVotes["totalVotes"]) * 100) + ((cityVotes[width2]/cityVotes["totalVotes"]) * 100)); 
                            })
                        .attr("y", 5)
                        .style('fill', color);

                      bar3.append("text")
                      .attr('class','bar')
                        .attr("x", function() { 
                              return  x(((cityVotes[width1]/cityVotes["totalVotes"]) * 100) + ((cityVotes[width2]/cityVotes["totalVotes"]) * 100)) + 25; 
                            })
                          .attr("y", 13)
                          .attr("dy", ".35em")
                          .style('fill','#fff')
                          .text(function() { return decimal((cityVotes[data] / cityVotes["totalVotes"]) * 100); }); 

                      }

                      cityBars("toryVotes",'#003399',"zero","zero");
                      cityBars("fordVotes",'#990000',"toryVotes","zero");
                      cityBars("chowVotes",'#6600FF',"toryVotes","fordVotes");

                      } 
                        
          
          //SUB-DIVISION BOUNDARIES
          path = d3.geo.path().projection(googleMapProjection);
          var polygons = adminDivisions.selectAll("path")
            .data(geoJson.features)
            .attr("d", path) // update existing paths
          .enter().append("svg:path")
            .attr("d", path)
            .attr('id', function(d) {return d.properties.AREA_LONG} );


          //WHITE WARD BOUNDARIES
          pathWards = d3.geo.path().projection(googleMapProjection);
          
          var polygonsWards = wardDivisions.selectAll("path")
            .data(geoJsonWards.features)
            .attr("d", pathWards)
            .enter();

          var polygonsWardNumbers = wardDivisions.selectAll("text")
                    .data(geoJsonWards.features)
                    .attr("x",function(d){
                        return path.centroid(d)[0];                         
                    })
                    .attr("y", function(d){
                        return path.centroid(d)[1];                         
                    }) 
                    .enter()                        
                    .append("text")
                    .text(function(d){
                        return d.properties.SCODE_NAME;
                    })
                    .attr("x",function(d){
                        return path.centroid(d)[0];                         
                    })
                    .attr("y", function(d){
                        return path.centroid(d)[1];

                    })
                    .attr("text-anchor","middle")
                    .attr('font-size','12pt')
                    .attr('class','wardNumber')
                    .style('fill','#fff');; 

          polygonsWards.append("svg:path")
            .attr('class','wardBoundaries')
            .attr("d", pathWards)
            .attr('id', function(d) {return d.properties.AREA_LONG} )
            .style('stroke','white')
            .style('stroke-width',2)
            .style('fill','none');

                    

            //RULES FOR MAP COLOUR SCHEME
            polygons.style('fill', function(d){
              if (d.properties.Chow_perc > d.properties.Ford_perc && d.properties.Chow_perc > d.properties.Tory_perc){
                return '#6600FF'
              }
              if (d.properties.Ford_perc > d.properties.Tory_perc && d.properties.Ford_perc > d.properties.Chow_perc){
                return '#990000'
              }
              if (d.properties.Tory_perc > d.properties.Ford_perc && d.properties.Tory_perc > d.properties.Chow_perc){
                return '#003399'
              }

            })
            .style('opacity', function(d) {
              if (d.properties.Chow_perc > 0.8 || d.properties.Ford_perc > 0.8 || d.properties.Tory_perc > 0.8 ){
                return 1
              }
              if (d.properties.Chow_perc > 0.7 || d.properties.Ford_perc > 0.7 || d.properties.Tory_perc > 0.7 ){
                return 0.8
              }
              if (d.properties.Chow_perc > 0.6 || d.properties.Ford_perc > 0.6 || d.properties.Tory_perc > 0.6 ){
                return 0.6
              }
              if (d.properties.Chow_perc > 0.5 || d.properties.Ford_perc > 0.5 || d.properties.Tory_perc > 0.5 ){
                return 0.4
              }
              if (d.properties.Chow_perc > 0.4 || d.properties.Ford_perc > 0.4 || d.properties.Tory_perc > 0.4 ){
                return 0.3
              }
              else {return 0.2}
            })
            ;


            //EVENTS - CALLING SIDEBAR AND REMOVING ELEMENTS
            polygons.on('mouseover', sideBar)
            .on('mouseout', function() {
              var removeTitle = d3.select('.title text').remove();
              var removeWard = d3.select('.ward text').remove();
              var removeDivision = d3.select('.division text').remove();
              var removeFord = d3.selectAll('.bar').remove();
              var removeText = d3.selectAll('.barText').remove();
              var removeLegend = d3.selectAll('.legend rect text').remove();
              return [removeTitle,removeWard, removeDivision, removeFord,removeText,removeLegend];
            });


        };

      };

      overlay.setMap(map);
      
      
    });
