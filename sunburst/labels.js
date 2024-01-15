
import {svg, color, arc} from "./sunburst.js";

export function labels() {
    // Adding text labels
    svg.selectAll(".node")
        .append("text")
        .style("fill", color[0])
        .attr("transform", function (d) {
            return "translate(" + arc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")";
        }) 
        .attr("dx", "-40")
        .attr("dy", ".5em")
        .text(function (d) { return d.parent ? d.data.name : "" }); 
    }

    
    // Function to rotate text 
    function computeTextRotation(d) {
        var angle = (d.x0 + d.x1) / Math.PI * 90;  // <-- 1
    
        // Avoid upside-down labels
        return (angle < 90 || angle > 270) ? angle : angle + 180;  // <--2 "labels aligned with slices"
    
        // Alternate label formatting
        //return (angle < 180) ? angle - 90 : angle + 90;  // <-- 3 "labels as spokes"
    
    }