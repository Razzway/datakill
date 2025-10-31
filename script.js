d3.json("data.json").then(data => {
 
  const annees = data.annees; 
  afficherGraphiqueLigne(annees);


///////////////////////////////////////////// Histogrammes ////////////////////////////////////////////////////
  Object.keys(data).forEach(key => {

    if (key.startsWith("dataBarre")) {
      const dataset = data[key]; 
      afficherGraphiqueBarre(dataset, key); 
    }
  });
});

function afficherGraphiqueBarre(dataset, key) {
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
            .domain(dataset.map(d => d.mois)) 
            .range([0, width])                     
            .padding(0.3);   

/////// Nom de l'axe
svgBar.append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height +   45)
    .attr("fill", "white")
    .text("Mois");
            

//////////////////////////// Ordonnée //////////////////////////////////////
const yScaleBar = d3.scaleLinear()
            .domain([0, d3.max(dataset, d => d.value)]) 
            .range([height, 0]);                      

              svgBar.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", `translate(0,${height})`) 
            .call(d3.axisBottom(xScaleBar));             

        svgBar.append("g")
            .attr("class", "y-axis axis")
            .call(d3.axisLeft(yScaleBar));      
        
/////. Nom de l'axe
svgBar.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left+20)
    .attr("x", -margin.top)
    .attr("fill", "white")
    .text("Nombre de Meurtre")

/////////////////////// Barres /////////////////////////////////////////////
        svgBar.selectAll(".bar")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScaleBar(d.mois))     
            .attr("y", d => yScaleBar(d.value))       
            .attr("width", xScaleBar.bandwidth())    
            .attr("height", d => height - yScaleBar(d.value))
            .attr("fill", "#640D14");

            };

            //////////////////////////////////// Graphique Linéaire //////////////////////////////////////////////


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
           
/////// Nom de l'axe
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
            
/////. Nom de l'axe
svgLine.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left+20)
    .attr("x", -margin.top)
    .attr("fill", "white")
    .text("Nombre de Meurtre")
            
//////////////////////////////////////////////
            
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


    // Add the points
    svgLine
      .append("g")
      .selectAll("dot")
      .data(annees)
      .enter()
      .append("circle")
        .attr("cx", function(d) { return xScaleLine(d.annee) } )
        .attr("cy", function(d) { return yScaleLine(d.value) } )
        .attr("r", 5)
        .attr("fill", "#f7fffdff")
}