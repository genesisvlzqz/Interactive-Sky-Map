//November 9 Log:
//Removed planet class
//added planets vector to star class
//renamed stars array to catalogue
//renamed habitable array to habcatalogue
//added zoom reset
//current candidates: 21
//--------------------------------------------------------------
//Request"
var request = new XMLHttpRequest();
request.open("GET", "http://interactiveskymap.com/i_skymap/planet_data.txt", false);
request.send(null)
  
//Parse the planet data
var data = JSON.parse(request.responseText);

//set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 50, left: 50},
width = 780 - margin.left - margin.right,
height = 485.4 - margin.top - margin.bottom;

//Zoom properties

function zoomed(){
  svg.attr("transform",d3.event.transform)
}
var zoom = d3.zoom().on("zoom",zoomed);

// append the svg object to the body of the page and enable zoom 
var svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .call(zoom)
  .append("g")
  .attr("transform",
  "translate(" + margin.left + "," + margin.top + ")");

//add star map background to svg measurements
var mapimage = svg.append("image")
  .attr("xlink:href","http://interactiveskymap.com/wp-content/uploads/2021/05/starmap.png")
  .attr("width", width)
  .attr("height", height);

// Declare arrays to store star objects and habitable candidates
var catalogue = [];
var habCatalogue = [];

//Creating object from class stars for every star in map.
for (let i in data){
  item = new star(data[i]['hostname'],data[i]['ra'],data[i]['dec'],data[i]['st_teff'],data[i]['sy_pnum'],data[i]['st_rad'],data[i]['sy_vmag'],data[i]['sy_dist']);
  item.setPlanets(data[i]['pl_name'],data[i]['pl_orbsmax'],data[i]['pl_rade'],data[i]['pl_bmasse']);
  catalogue.push(item);
}
//checking Habitability flag and storing in habCatalogue if true
for (let i  in catalogue){
  item = catalogue[i].getPlanets()
  if (item[0][4]==true){
    habCatalogue.push(catalogue[i]);
  }
}

// Add X axis Bottom
var x = d3.scaleLinear()
.domain([0,24])
.range([width,0]);
svg.append("g")
.attr("transform", "translate(0," + height + ")")
.call(d3.axisBottom(x));

// Add X axis top
var xtop = d3.scaleLinear()
.domain([0,24])
.range([width, 0]);
svg.append("g")
.attr("transform", "translate(0,0)")
.call(d3.axisBottom(xtop));


// Add Y axis
var y = d3.scaleLinear()
.domain([-90, 90])
.range([height,0]);
svg.append("g")
.call(d3.axisLeft(y).ticks(6));

// Add Right Y axis
var yright = d3.scaleLinear()
.domain([-90, 90])
.range([height,0]);
svg.append("g")
.attr("transform", "translate("+width+",0)")
.call(d3.axisRight(yright).ticks(6));

// Add a scale for bubble size
var z = d3.scaleLinear()
.domain([200000, 1310000000])
.range([ 4, 40]);

// Define the div for the tooltip
var div = d3.select("#my_dataviz").append("div")	
.attr("class", "tooltip")				
.style("opacity", 0);

//Display Name + Number of planets on in system.
var viewsystem = function(d) {
  window.open("https://exoplanetarchive.ipac.caltech.edu/overview/" + d.getName(), "_blank")
}

//Set circle color based on temperature
var setColor = function(d) {
  return d.getColor();
}


// Axis Label x
svg.append("text")
.attr("class", "x label")
.attr("text-anchor", "middle")
.attr("x", width/2)
.attr("y", height + 30)
.text("Right Ascencion (hours)");

// Axis Label y
svg.append("text")
.attr("class", "y label")
.attr("text-anchor", "middle")
.attr("y", 6)
.attr("dy", ".75em")
.attr("transform", "translate(-50,"+(height/2)+") rotate(-90) ")
.text("Declination (°)");

//-------------------------------------
function createLegend(){
  // Declare Legend Constants
  var offset = 30; //separation between labels
  var color = ["red", "orange","yellow","white","lightblue","blue","black"]; // Spectral type colors
  var type = ["M", "K", "G","F","A","B","O"] // Spectral Type Names

  // Add Legend
  for ( let i = 0; i < 7; i++) {
    svg.append("circle")
    .attr("cx",offset*i)
    .attr("cy",height+30)
    .attr("r", 4)
    .style("stroke", "gray")
    .style("stroke-width", 1)
    .style("fill", color[i])
    svg.append("text")
    .attr("x", (offset*i+10))
    .attr("y", height+35)
    .text(type[i])
    .style("font-size", "12px")
    .attr("alignment-baseline","middle")
  } 
}

//-------------------------------------
 function update(){
  // For each check box:
  d3.selectAll("#hab").each(function(d){
    cb = d3.select(this);
    grp = hab;
    var datatouse
    // If the box is checked, show only hab candidates
    if(cb.property("checked")){
      datatouse = habCatalogue;
    }
    else {
      datatouse = catalogue;
    }
      svg.selectAll("circle").remove();
      createLegend();
      svg.append('g')
      .selectAll("dot")
      .data(datatouse)
      .enter()
      .append("circle")
      .attr("class", "bubbles")
      .attr("cx", function (d) { return x(d.getRA()* (1/15)); } ) //1 hour RA = 15 Degrees RA
      .attr("cy", function (d) { return y(d.getDec()); } )
      .attr("r", 3)
      .style("stroke", "gray")
      .style("stroke-width", 1)
      .style("fill", setColor)
      .style("opacity", 1)
        //Trigger hover, click, mouseout 
        .on("click", viewsystem)
        .on("mouseover", function(d) {		
          div.transition()		
              .duration(200)		
              .style("opacity", .9);		
          div.html(d.getName() + "<br/>"  + "Planets: " + d.getPlNum())	
              .style("left", (d3.event.pageX) + "px")		
              .style("top", (d3.event.pageY - 28) + "px");	
          })					
      .on("mouseout", function(d) {		
          div.transition()		
              .duration(500)		
              .style("opacity", 0);	
      }) //end of add dots
    }
  )}

//call update upon click
d3.selectAll("#hab").on("change",update);
$("#Reset").click(() => {
  svg.transition()
    .duration(750)
    .call(zoom.transform, d3.zoomIdentity.scale(1))
    .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");
  });
//Initialize update function
update();