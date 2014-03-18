/**
 * This OverLayView is a generic interface to handle overlays on any
 * of map (e.g. Google, Nokia, etc).
 *
 */
Ext.define('CC.view.MapOverLayView', {
  alias: 'widget.MapOverLayView',
  
  constructor: function(context) {
     var me = this;
     this.svgPlace =  context.svgPlace;
     this.overlay = context.overlay;
     //this.projection = context.projection;
     this.latLngToPix = context.latLngToPix;
     this.latLngObj = context.latLngObj;
     var width = context.width;
     var height = context.height / 2;
     
     this.center = d3.geo.centroid(CC.util.Constants.DATA);
      var scale = 10;
      this.projection = d3.geo.mercator().center(this.center)
                       .scale(scale)
                       .translate([width / 2, height / 2]);
      this.path = d3.geo.path().projection(this.projection);
      var bounds  = this.path.bounds(CC.util.Constants.DATA);
      var hscale  = scale*width  / (bounds[1][0] - bounds[0][0]);
      var vscale  = scale*height / (bounds[1][1] - bounds[0][1]);
      var scale   = (hscale < vscale) ? hscale : vscale;
      var offset  = [width - (bounds[0][0] + bounds[1][0])/2,
                          height - (bounds[0][1] + bounds[1][1])/2];
       
       this.projection = d3.geo.mercator().center(this.center)
                                          .scale(scale)
                                          .translate(offset);
      
   //   this.projection = d3.geo.mercator()
   //                      .scale(1)
   //                      .translate([0, 0]);
   //   this.path = d3.geo.path().projection(this.projection);
   //   var b = this.path.bounds(CC.util.Constants.DATA),
   //          s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
   //          t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
   // // Update the projection to use computed scale & translate.
   //  this.projection
   //        .scale(s)
   //        .translate(t);
   //  
      this.path = this.path.projection(this.projection);
      this.svg = d3.select("#svg-overlay").append("svg")
                                        .attr("width", context.width)
                                        .attr("height", context.height);
     // this.zoom = d3.behavior.zoom()
     //                        .scale(this.projection.scale() * 2 * Math.PI)
     //                        .scaleExtent([1 << 11, 1 << 14])
     //                        //.translate(offset)
     //                        //.translate([context.width - this.center[0], context.height - this.center[1]])
     //                        .on("zoom", this.zoomed);
    this.drawLinks(CC.util.Constants.DATA)
      
  },

  drawLinks: function(geoJson) {
    // var overProjection = this.projection(this.overlay);
    // var me = this;
    // 
    // // Turn the overlay projection into a d3 projection
    // var mapProjection = function(coordinates) {
    //   var coordinates = me.latLngObj(coordinates[1], coordinates[0]);
    //   var pixelCoordinates = me.latLngToPix(coordinates, overProjection);
    //   return [pixelCoordinates.x, pixelCoordinates.y];
    // }
    this.vector = this.svg.append("path");
    //this.svg.call(this.zoom);
    this.vector.attr("d", this.path(geoJson.features[0]))
                .attr("stroke", "blue")
                .attr("fill", "none");  
    // this.vector = this.svg.selectAll("path")
    //     .data(geoJson.features)
    //     .enter()
    //     .append("path")
    //     .attr("d", this.path)
    //     .attr("stroke", "blue")
    //     .attr("fill", "none");  
    //this.zoomed();
    
    //translation = d3.geo.path().projection(mapProjection);
    
    // me.layer.selectAll("path")
    //  .data(geoJson.features)
    //  .enter()
    //  .append("path")
    //  .attr("d", translation)
    //  .attr("stroke", "blue")
    //  .attr("fill", "none");     
  },
  drawNodes: function(points) {
    var overlayProjection = this.projection(this.overlay);
    var me = this;
    var marker =  me.layer.selectAll(".marker")
                  .data(points)
                  .each(transform)
                  .enter()
                  .append("svg:svg")
                  .each(transform)
                  .attr("class", "marker")
                  .append("svg:circle")
                  .attr("cx", "10")
                  .attr("cy", "10")
                  .attr("r", "8")
                  .attr("fill", "white")
                  .attr("stroke", "blue")
                  .attr("stroke-width", "3");
                 
    function transform(d) { 
      d = me.latLngObj(d[1], d[0]);
      d = me.latLngToPix(d, overlayProjection);
      return d3.select(this)
        .style("left", (d.x - 10) + "px")
        .style("top", (d.y - 10) + "px");
    }
  },
  zoomed: function() {
    this.vector
        .attr("transform", "translate(" + this.zoom.translate() + ")")
         .style("stroke-width", 10);
         //scale(" + this.zoom.scale() + ")")
   }
});