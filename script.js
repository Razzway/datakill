
///////////////////////////////////// Disparition Texte ///////////////////////////////////////////

const video = document.querySelector("video");

video.addEventListener("play", () => {
  document.body.style.overflow = "hidden";   // Bloque scroll pendant vidéo
  document.querySelector("main").style.display = "none";
});

video.addEventListener("ended", () => {
  video.style.display = "none";
  document.body.style.overflow = "auto";     // Restaure le scroll
  document.querySelector("main").style.display = "block";
});

/////////////////////////////////// Sources /////////////////////////////////////////////////////

document.querySelector(".lien-sources").addEventListener('click', function (){

  document.getElementById("sources").style.display="block";
  document.querySelector("body").style.overflow="hidden";
});

document.querySelector(".button-sources").addEventListener('click', function (){

  document.getElementById("sources").style.display="none";
  document.querySelector("body").style.overflow="auto";
});


/////////////////////////////////// Mention légale ////////////////////////////////////////////////

document.querySelector(".lien-mention-legale").addEventListener('click', function (){

  document.getElementById("mention-legale").style.display="block";
  document.querySelector("body").style.overflow="hidden";
});

document.querySelector(".button-mention-legale").addEventListener('click', function (){

  document.getElementById("mention-legale").style.display="none";
  document.querySelector("body").style.overflow="auto";
});


///////////////////////////////////////////////// Map /////////////////////////////////////////////////////////////
d3.json("populationData.json").then(data1 => {  
  const svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

  const projection = d3.geoMercator()
    .scale(120)
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
            .style("background-color", "black")
            .style("color", "white") 
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
  const margin = { top: 20, right: 30, bottom: 80, left: 60 };
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


const xAxis = svgBar.append("g")
  .attr("class", "x-axis axis")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(xScaleBar));


xAxis.selectAll("text")
  .style("font-size", "1rem")
  .style("fill", "white")
  .attr("text-anchor", "end")
  .attr("transform", "rotate(-45)")
  .attr("dx", "-0.5em")              
  .attr("dy", "0.5em");            


svgBar.append("text")
  .attr("text-anchor", "end")
  .attr("x", width)
  .attr("y", height + 80)  
  .attr("fill", "white")
  .text("Mois");

            
//////////////////////////// Ordonnée //////////////////////////////////////
  const yScaleBar = d3.scaleLinear()
              .domain([0, d3.max(dataBarre, d => d.value)]) 
              .range([height, 0]);                      

                          

          svgBar.append("g")
              .attr("class", "y-axis axis")
              .call(d3.axisLeft(yScaleBar))
              .selectAll("text") 
              .style("font-size", "1rem") 
              .style("fill", "white");    
        
////// Nom de l'axe //////
  svgBar.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left+13)
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
  const margin = { top: 20, right: 30, bottom: 60, left: 80 };
  const width = 700 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svgLine = d3.select("#linear-graph-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  //////////////////////////// Abscisse //////////////////////////////////////
  const xScaleLine = d3.scalePoint()
    .domain(annees.map(d => d.annee))
    .range([0, width]);

 
  const xAxis = svgLine.append("g")
    .attr("class", "x-axis axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScaleLine));

  
  xAxis.selectAll("text")
    .style("font-size", "1rem")
    .style("fill", "white")
    .attr("text-anchor", "middle");

////// Nom de l'axe //////
  svgLine.append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + 55)
    .attr("fill", "white")
    .text("Année");

  //////////////////////////// Ordonnée //////////////////////////////////////
  const yScaleLine = d3.scaleLinear()
    .domain([0, d3.max(annees, d => d.value)])
    .range([height, 0]);

  
  svgLine.append("g")
    .attr("class", "y-axis axis")
    .call(d3.axisLeft(yScaleLine))
    .selectAll("text")
    .style("font-size", "1rem")
    .style("fill", "white");

  ////// Nom de l'axe //////
  svgLine.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 12)
    .attr("x", -margin.top)
    .attr("fill", "white")
    .text("Nombre de Meurtre");

  ////////////////////////////  Trait //////////////////////////////////
  svgLine.append("path")
    .datum(annees)
    .attr("fill", "rgba(126, 42, 42, 0.3)")
    .attr("stroke", "#640D14")
    .attr("stroke-width", 5)
    .attr("d", d3.area()
      .x(d => xScaleLine(d.annee))
      .y0(yScaleLine(0))
      .y1(d => yScaleLine(d.value))
    );

  //////////////////////////// Points + Tooltip ////////////////////////////
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

  svgLine.append("g")
    .selectAll("circle")
    .data(annees)
    .enter()
    .append("circle")
    .attr("cx", d => xScaleLine(d.annee))
    .attr("cy", d => yScaleLine(d.value))
    .attr("r", 6.5)
    .attr("fill", "#f7fffdff")
    .on("mouseover", function(event, d) {
      tooltipLine.style("visibility", "visible")
        .html(`<strong>${d.annee}</strong><br>${d.value} meurtres`);
    })
    .on("mousemove", function(event) {
      tooltipLine
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px");
    })
    .on("mouseout", function() {
      tooltipLine.style("visibility", "hidden");
    });
}




// Sélecteur d'images et mise à jour des informations
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const killers = data.serialkillers;
    const container = document.querySelector('.img-selector');
    const images = Array.from(container.querySelectorAll('img'));

    // Crée un tableau pour gérer les positions
    function calculatePositions() {
      const containerWidth = container.clientWidth;
      return [
        containerWidth * 0.1,                         // gauche
        containerWidth * 0.5 - (containerWidth * 0.115), // centre
        containerWidth * 0.8                           // droite
      ];
    }

    // Met à jour le contenu du killerBlock
    function updateKillerInfo(killerName) {
      const killer = killers.find(k => k.nom === killerName);
      if (!killer) return;

      document.getElementById('killerName').textContent = killer.nom;
      document.getElementById('killerNickname').textContent = killer.surnom;
      document.getElementById('killerPeriod').textContent = killer.periode_activite;
      document.getElementById('killerVictims').textContent =
        `${killer.victimes_connues} (${killer.victimes_femmes} femmes, ${killer.victimes_hommes} hommes)`;
      document.getElementById('killerModus').textContent = killer.modus_operandi;
      document.getElementById('killerArrest').textContent = killer.arrestation;
      document.getElementById('killerSentence').textContent = killer.condamnation;

      // Image silhouette
      const silhouetteContainer = document.getElementById('silhouetteContainer');
      silhouetteContainer.innerHTML = ''; // on vide le précédent contenu

      if (killer.img_ombres) {
        const img = document.createElement('img');
        img.src = killer.img_ombres;
        img.alt = `Silhouette de ${killer.nom}`;
        img.classList.add('fade-in'); // optionnel pour l’animation
        silhouetteContainer.appendChild(img);
      }

      // Animation du bloc principal (fade-in)
      const block = document.querySelector('.killerBlock');
      block.style.opacity = 0;
      setTimeout(() => block.style.opacity = 1, 200);
    }


    // Déplacement des images avec animation
    function moveToMiddle(selectedImg) {
      const positions = calculatePositions();
      const imgs = images.filter(img => img !== selectedImg);

      // Image centrale
      selectedImg.style.left = positions[1] + 'px';
      selectedImg.style.width = '23%';
      selectedImg.style.boxShadow = '0 0 20px red';
      selectedImg.style.zIndex = 2;

      // Autres images
      imgs[0].style.left = positions[0] + 'px';
      imgs[0].style.width = '10%';
      imgs[0].style.boxShadow = '#0d1012 2px 2px 5px';
      imgs[0].style.zIndex = 1;

      imgs[1].style.left = positions[2] + 'px';
      imgs[1].style.width = '10%';
      imgs[1].style.boxShadow = '#0d1012 2px 2px 5px';
      imgs[1].style.zIndex = 1;
    }

    images.forEach(img => {
      img.addEventListener('click', () => {
        moveToMiddle(img);
        updateKillerInfo(img.dataset.killer);
      });
    });

    // Sélection par défaut : Guy Georges
    const defaultImg = images.find(img => img.dataset.killer === 'Guy Georges');
    if (defaultImg) {
      moveToMiddle(defaultImg);
      updateKillerInfo('Guy Georges');
    }

    // Recalcul des positions si la fenêtre est redimensionnée
    window.addEventListener('resize', () => {
      const centralImg = images.find(img => parseInt(img.style.left) === calculatePositions()[1]);
      if (centralImg) moveToMiddle(centralImg);
    });
  })
  .catch(error => console.error('Erreur de chargement du JSON :', error));
