d3.json("data.json").then(data => {
 

  Object.keys(data).forEach(key => {

    if (key.startsWith("dataBarre")) {
      const dataset = data[key]; 
      afficherGraphique(dataset, key); 
    }
  });
});

function afficherGraphique(dataset, key) {
 const margin = { top: 20, right: 30, bottom: 40, left: 40 };
        const width = 700 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

const svgBar = d3.select("#bar-chart-container")
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