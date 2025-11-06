d3.json("populationData.json").then(data1 => {  
  const svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

  const projection = d3.geoMercator()
    .scale(100)
    .center([0, 20])
    .translate([width / 2, height / 2]);


  const populationData = new Map(data1.pays.map(d => [d.name, { value: d.value, nom: d.nom }]));

 
  d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
    .then(function(topo) {

      const tooltipLine = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "white")
        .style("border", "solid 1px #ccc")
        .style("border-radius", "5px")
        .style("padding", "8px")
        .style("font-size", "14px")
        .style("color", "black");

  
      let mouseOver = function(event, d) {
        d3.selectAll(".Country")
          .transition()
          .duration(200)
          .style("opacity", .5);

        d3.select(this)
          .transition()
          .duration(200)
          .style("opacity", 1);

        const afficheData = populationData.get(d.properties.name);

        if (afficheData) {
          tooltipLine
            .style("visibility", "visible")
            .html(`<strong>${afficheData.nom}</strong><br>Taux : ${afficheData.value}`);
        } else {
          tooltipLine
            .style("visibility", "visible")
            .html(`<strong>${d.properties.name}</strong><br>Taux : Inconnu`);
        }
      };

      let mouseMove = function(event, d) {
        tooltipLine
          .style("top", (event.pageY - 30) + "px")
          .style("left", (event.pageX + 10) + "px");
      };

      let mouseLeave = function(event, d) {
        d3.selectAll(".Country")
          .transition()
          .duration(200)
          .style("opacity", .8);

        tooltipLine.style("visibility", "hidden");
      };


      svg.append("g")
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        .attr("d", d3.geoPath().projection(projection))
        .attr("class", "Country")
        .attr("fill", "rgba(255, 252, 252, 1)")
        .style("stroke", "black")
        .on("mouseover", mouseOver)
        .on("mousemove", mouseMove)
        .on("mouseleave", mouseLeave);
    });
});



/////////////////////////////////////////////// GRAPHIQUES ///////////////////////////////////////////////////////////////
 
d3.json("data.json").then(data2 => {  

const data = data2; 
const annees = data.annees; 
afficherGraphiqueLigne(annees);

  const select = document.getElementById('annee-select');

  function changerGraphique() {
    const n = select.value; 
    const dataBarre = data[`dataBarre${n}`];    
    d3.select("#bar-graph-container").selectAll("*").remove();
    afficherGraphiqueBarre(dataBarre);
  }

 
  select.addEventListener('change', changerGraphique);
  select.value = "moy";
  changerGraphique();
});


///////////////////////////////////////////// Histogrammes ////////////////////////////////////////////////////
  

function afficherGraphiqueBarre(dataBarre) {
  const margin = { top: 20, right: 30, bottom: 50, left: 60 };
          const width = 700 - margin.left - margin.right;
          const height = 400 - margin.top - margin.bottom;

  const svgBar = d3.select("#bar-graph-container")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", `translate(${margin.left},${margin.top})`);

//////////////////////////// Abscisse //////////////////////////////////////
  const xScaleBar = d3.scaleBand()
              .domain(dataBarre.map(d => d.mois)) 
              .range([0, width])                     
              .padding(0.3);   

/////// Nom de l'axe ///////
  svgBar.append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height +   45)
      .attr("fill", "white")
      .text("Mois");
            
//////////////////////////// Ordonnée //////////////////////////////////////
  const yScaleBar = d3.scaleLinear()
              .domain([0, d3.max(dataBarre, d => d.value)]) 
              .range([height, 0]);                      

                svgBar.append("g")
              .attr("class", "x-axis axis")
              .attr("transform", `translate(0,${height})`) 
              .call(d3.axisBottom(xScaleBar));             

          svgBar.append("g")
              .attr("class", "y-axis axis")
              .call(d3.axisLeft(yScaleBar));      
        
////// Nom de l'axe //////
  svgBar.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left+20)
      .attr("x", -margin.top)
      .attr("fill", "white")
      .text("Nombre de Meurtre")

/////////////////////// Barres /////////////////////////////////////////////
  const tooltipBar = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "white")
    .style("border", "solid 1px #ccc")
    .style("border-radius", "5px")
    .style("padding", "8px")
    .style("font-size", "14px")
    .style("color", "black");


  svgBar.selectAll(".bar")
              .data(dataBarre)
              .enter()
              .append("rect")
              .attr("class", "bar")
              .attr("x", d => xScaleBar(d.mois))     
              .attr("y", d => yScaleBar(d.value))       
              .attr("width", xScaleBar.bandwidth())    
              .attr("height", d => height - yScaleBar(d.value))
              .attr("fill", "#640D14")
              .on("mouseover", function(event, d) {
                tooltipBar.style("visibility", "visible")
                        .html(`<strong>${d.mois}</strong><br>${d.value} meurtres`); })
              .on("mousemove", function(event) {
                tooltipBar.style("top", (event.pageY - 30) + "px")
                        .style("left", (event.pageX + 10) + "px");})
                .on("mouseout", function() {
                  tooltipBar.style("visibility", "hidden");});
};

///////////////////////////////////////////// Graphique Linéaire /////////////////////////////////////////////////
function afficherGraphiqueLigne(annees) {
  const margin = { top: 20, right: 30, bottom: 50, left: 70 };
          const width = 700 - margin.left - margin.right;
          const height = 400 - margin.top - margin.bottom;

  const svgLine = d3.select("#linear-graph-container")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", `translate(${margin.left},${margin.top})`);

//////////////////////////// Abscisse //////////////////////////////////////
  const xScaleLine =  d3.scalePoint()
              .domain(annees.map(d => d.annee)) 
              .range([0, width])                     
           
/////// Nom de l'axe ///////
  svgLine.append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height +   45)
      .attr("fill", "white")
      .text("Année");

//////////////////////////// Ordonnée //////////////////////////////////////
  const yScaleLine = d3.scaleLinear()
              .domain([0, d3.max(annees, d => d.value)]) 
              .range([height, 0]);                      

                svgLine.append("g")
              .attr("class", "x-axis axis")
              .attr("transform", `translate(0,${height})`) 
              .call(d3.axisBottom(xScaleLine));             

          svgLine.append("g")
              .attr("class", "y-axis axis")
              .call(d3.axisLeft(yScaleLine));   
              
/////// Nom de l'axe ///////
  svgLine.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left+20)
      .attr("x", -margin.top)
      .attr("fill", "white")
      .text("Nombre de Meurtre")
            
////////////////////////////////// Trait //////////////////////////////////

    svgLine.append("path")
      .datum(annees)
      .attr("fill", "rgba(126, 42, 42, 0.3)")
      .attr("stroke", "#640D14")
      .attr("stroke-width", 5)
      .attr("d", d3.area()
        .x(function(d) { return xScaleLine(d.annee) })
        .y0(yScaleLine(0))
        .y1(function(d) { return yScaleLine(d.value) })
        )

//////// Points ///////
  const tooltipLine = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "white")
    .style("border", "solid 1px #ccc")
    .style("border-radius", "5px")
    .style("padding", "8px")
    .style("font-size", "14px")
    .style("color", "black");


  svgLine
    .append("g")
    .selectAll("dot")
    .data(annees)
    .enter()
    .append("circle")
    .attr("cx", function(d) { return xScaleLine(d.annee) } )
    .attr("cy", function(d) { return yScaleLine(d.value) } )
    .attr("r", 6.5)
    .attr("fill", "#f7fffdff")
    .on("mouseover", function(event, d) {
        tooltipLine.style("visibility", "visible")
                    .html(`<strong>${d.annee}</strong><br>${d.value} meurtres`); })
    .on("mousemove", function(event) {
        tooltipLine.style("top", (event.pageY - 30) + "px")
                    .style("left", (event.pageX + 10) + "px");})
    .on("mouseout", function() {
        tooltipLine.style("visibility", "hidden");});
    }
