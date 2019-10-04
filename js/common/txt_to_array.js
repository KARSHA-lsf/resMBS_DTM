function txt_to_array(file){
    d3.text(file).then(function(text) {

        file_content = text.replace("\r","").split("\n")
        //console.log(file_content); // Hello, world!
        var data = []
        for (let index = 1; index < 31; index++) {
            const begin_point = (index-1)*7+1
            for(let k= begin_point; k<begin_point+5; k++){
                const weight = file_content[k].split("*")[0]
                const comp_role = file_content[k].split(/"/)[1]
                const fi_name = file_content[k].split("--")[1].replace("\r","")
                const role = comp_role.split("+")[1]
                var tp = new topic(index, weight, comp_role, fi_name,role);
                data.push(tp)
            }
        }
        return data
        
      }).then(function(data){

        for (let topic = 1; topic < 31; topic++) {
          var topic_data = data.filter(function(d){ return d.topic == topic})
          
          // create nodes array for sankey
          var nodes=[]
          //var FIs = d3.map(topic_data, function(d){return d.comp_role,d.fi_name;}).keys()
          
          topic_data.forEach(ele => {
              let trunc_fiName = company_name_trunctated(20,ele.fi_name)
              let role = (ele.comp_role.split("+")[1]== null) ? "" : ele.comp_role.split("+")[1];
              
              nodes.push(new sankey_node_prototype(nodes.length,ele.comp_role,trunc_fiName+"+"+role))
          });
          
          var target_node =  new sankey_node_prototype(nodes.length,"","")
          nodes.push(target_node)
          //console.log(nodes)
          

          //create links array for sankey
           var links =[]
          topic_data.forEach(ele => {
              var target = nodes.find(function(e){
                  return e.name == ""
              });
              var source = nodes.find(function(e){
                  return e.name == ele.comp_role
              });
              links.push(new sankey_link_prototype(source.node, target.node ,ele.weight))
          }); 
          //console.log()
          draw_sankey_baseline("chart"+topic,topic,{ nodes:nodes, links:links})
        
      }
        
        
      })    
}

function draw_sankey_baseline(div_id,topic_id,graph){
  console.log(graph)
      d3.selectAll('#'+div_id+' svg').remove();
      var units = "Widgets";
  
      // set the dimensions and margins of the graph
      var margin = {top: 100, right: 10, bottom: 10, left: 10},
          width = 300 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;
      
      // format variables
      var formatNumber = d3.format(",.0f"),    // zero decimal places
          format = function(d) { return formatNumber(d) + " " + units; },
          color = d3.scaleOrdinal(d3.schemeCategory10);
      
      // append the svg object to the body of the page
      var svg = d3.select("div#"+div_id).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .classed("svg-content", true)
        .append("g")
          .attr("transform", 
                "translate(" + margin.left + "," + margin.top + ")");
      
      // Set the sankey diagram properties
      var sankey = d3.sankey()
          .nodeWidth(8)
          .nodePadding(15)
          .size([width, height]);
      
      var path = sankey.link();
      
      // load the data
      //d3.json("data/test/test.json").then(function(graph) {
      //console.log(graph.nodes.sort((a, b) => (a.name > b.name) ? 1 : -1))
     // console.log(graph.nodes)
      //console.log(graph.links)
        sankey
            .nodes(graph.nodes)
            .links(graph.links)
            .layout(0);
      
      // add in the links
        var link = svg.append("g").selectAll(".link")
            .data(graph.links)
          .enter().append("path")
            .attr("class", "link")
            .attr("d", path)
            .style("stroke", "#b2beb5")
            .style("stroke-width", function(d) { return Math.max(1, d.dy); })
            .sort(function(a, b) { return b.dy - a.dy; });
      
      // add the link titles
        link.append("title")
              .text(function(d) {
                  return d.source.name + " → " + 
                      d.target.name + "\n" + d.value; });
      
      // add in the nodes
        var node = svg.append("g").selectAll(".node")
            .data(graph.nodes)
          .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { 
                return "translate(" + d.x + "," + d.y + ")"; })
            .call(d3.drag()
              .subject(function(d) {
                return d;
              })
              .on("start", function() {
                this.parentNode.appendChild(this);
              })
              .on("drag", dragmove));
      
      // add the rectangles for the nodes
        node.append("rect")
            .attr("height", function(d) { return d.dy; })
            .attr("width", sankey.nodeWidth())
            .style("fill", function(d) { 
                return d.color = color(d.name.replace(/ .*/, "")); })
            .style("stroke", function(d) { 
                return d3.rgb(d.color).darker(2); })
          .append("title")
            .text(function(d) { 
                return d.name + "\n" + format(d.value); });
      
      // add in the title for the nodes
        node.append("text")
            .attr("x", -6)
            .attr("y", function(d) { return d.dy / 2; })
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .attr("transform", null)
            .text(function(d) { return d.fi; })
          .filter(function(d) { return d.x < width / 2; })
            .attr("x", 6 + sankey.nodeWidth())
            .attr("text-anchor", "start");
  
      //chart title
      svg.append("text")
        .attr("class", "title")
        .attr("x", width/2)
        .attr("y", (- margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "15px")
        .text('Topic'+topic_id);
      
      // the function for moving the nodes
        function dragmove(d) {
          d3.select(this)
            .attr("transform", 
                  "translate(" 
                     + d.x + "," 
                     + (d.y = Math.max(
                        0, Math.min(height - d.dy, d3.event.y))
                       ) + ")");
          sankey.relayout();
          link.attr("d", path);
        }
    
  
  }

function topic(topic, weight, comp_role, fi_name,role) {
    this.topic = topic;
    this.weight = weight;
    this.comp_role = comp_role;
    this.fi_name = fi_name;
    this.role = role;
  }

function sankey_node_prototype(node,name,fi){
    this.node = node
    this.name = name
    this.fi = fi
}

function sankey_link_prototype(source,target,value){
    this.source = source
    this.target = target
    this.value = value
}
  