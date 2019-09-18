function draw_me(data_param,data_main, data_mapping,data_counts){
    
    var y2_axis = true;
    var y1_axis = true;
    var chart_height = 600;
    if(data_param =='topic'){
        y2_axis = false
    }else if(data_param == 'prospectus'){
        y1_axis = false
        chart_height = 400
    }else{

    }

    d3.csv(data_main)
      .then(function(data) {

        d3.tsv(data_mapping)
          .then(function(FI_names){
        
          d3.csv(data_counts)
            .then(function(Prospectus_cnt){
            
           

            for (let index = 1; index < 31; index++) {
              var data_arr = data_procesor(
                data.filter(function(d){ return d.Topic == index }),FI_names,
                Prospectus_cnt.filter(function(d){ return d.Topic == 'Topic '+index },),
                data_param)
                

              var chart = c3.generate({
                  bindto: '#chart'+index,
                  title: {
                    show: true,
                    text: 'Topic'+index,
                    position: 'top-center',   // top-left, top-center and top-right
                    padding: {
                      top: 20,
                      right: 20,
                      bottom: 40,
                      left: 50
                    }
                  },
                  data: {
                      x: 'year',
                      columns: data_arr,
                      axes: {
                           prospectus_count_all: 'y2',
                           prospectus_count_bloomberg: 'y2'
                       },
                      types: {
                        prospectus_count_all: 'bar',
                        prospectus_count_bloomberg: 'bar'
                      },
                      colors: {
                        prospectus_count_all: '#E7D77D',
                        prospectus_count_bloomberg: '#9C84A2',
                          
                      },
                      
                  },
                  axis: {
                    x: {
                        label: 'year'
                    },
                    y: {
                        label: 'weight',
                        show: y1_axis,
                    },
                    y2: {
                      show: y2_axis,
                      label: 'Prospectus Count'
                    }
                  },
                  size: {
                      height: chart_height,
                      width: 300
                  },

              });
              
            }
        
      })  
      })
      })
        .catch(function(error){ 
        // handle error   
        })

      .catch(function(error){
        // handle error   
      })
    }

      function data_procesor(data,FI_names,Prospectus_cnt,data_param){

        var year = ['year',2002,2003,2004,2005,2006,2007,2008]
        var  all_counts = prospectus_count_info(Prospectus_cnt)
        var viz_data = []
        viz_data.push(year)
        

        if(data_param =='topic'){
            viz_data = topic_loading(viz_data,data,FI_names);
            
        }else if(data_param == 'prospectus'){
           
            viz_data.push(all_counts[0])
            viz_data.push(all_counts[1])
    
        }else{
            viz_data.push(all_counts[0])
            viz_data.push(all_counts[1])
            viz_data = topic_loading(viz_data,data,FI_names);
        }
        
        
        return viz_data
        
        
        
      }

      function topic_loading(viz_data,data,FI_names){

        var comp_roles = d3.map(data, function(d){return(d.comp_role)}).keys()
        
        for(let i =1; i<comp_roles.length; i++){
          var FI = FI_name_mapping(FI_names, comp_roles[i])
         
          var weight = [FI]
          
          for(let yr = 2002; yr<2009;yr++){
            var level1 = data.filter(function(d){ return d.comp_role == comp_roles[i] && d.Year == yr })
            //var level1 = data.filter(function(d){ return d.Year == yr })

            if(level1.length>0){
              weight.push(level1[0]['weight'])
              
            }else{
              weight.push(null)
            }
           
            
           }
           viz_data.push(weight)
        }
        return viz_data

      }

      function prospectus_count_info(data){
        var all = {}
        prsopectus_count_all = ['prospectus_count_all']
        prsopectus_count_bloom = ['prospectus_count_bloomberg']
        for(let yr = 2002; yr<2009;yr++){
          var level1 = data.filter(function(d){ return d.Year == yr })
          if(level1.length>0){
              prsopectus_count_all.push(level1[0]['Prospectus_count_all'])
              prsopectus_count_bloom.push(level1[0]['Prospectus_count_bloomberg'])
              
            }else{
              prsopectus_count_all.push(null)
              prsopectus_count_bloom.push(null)
            }
        }
        return [prsopectus_count_all,prsopectus_count_bloom]
      }

      function FI_name_mapping(Names, identifier){
        identifier_new = identifier.split("+")
        
        var name_match = Names.filter(function(d){ return d.FI == identifier_new [0].toUpperCase()})
        
        if(name_match.length>0){
          return name_match[0]['FI_Name']+"+"+identifier_new [1]
        }else{
          return identifier

        }
        
      }