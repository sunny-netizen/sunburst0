// https://denjn5.github.io/ 
// great explanations https://gist.github.com/denjn5/e1cdbbe586ac31747b4a304f8f86efa5
// zoomable https://observablehq.com/@d3/zoomable-sunburst
// widths https://stackoverflow.com/questions/4787527/how-to-find-the-width-of-a-div-using-vanilla-javascript 
// defs https://stackoverflow.com/questions/25881186/d3-fill-shape-with-image-using-pattern

const nodeData = {
    "name": "TOPICS", "image": "tree.png",
    "children": [{
        "name": "Graphs",
        "children": [
            { "name": "Percolation", "image": "lcc123.png", "size": 4 },
            { "name": "Emissions", "image": "sankey3.png", "size": 4 },
            { "name": "Energy", "image": "energy.png", "size": 4 }
        ]
    }, {
        "name": "Maps",
        "children": [
            { "name": "Streets", "image": "santamonica.png", "size": 3 },
            { "name": "Europe", "image": "allnodes.png", "size": 3 },
            { "name": "Creek", "image": "watershed.png", "size": 3 },
            { "name": "Planets", "image": "exomap.png", "size": 3
            }]
    }, {
        "name": "Hierarchies",
        "children": [
            { "name": "Tree", "image": "tree.png", "size": 4 },
            { "name": "Sunburst", "image": "sunburst.png", "size": 4 }
        ]
    }]
};
console.log(nodeData)

const width = window.innerWidth;
const height = window.innerHeight;
const radius = Math.min(width, height) / 3.5;
//const color = d3.scaleOrdinal(["#B5FED9", "#98CBB4", "#7BA098"]); // #423B0B
//const color = d3.scaleOrdinal(["#FDE74C", "#FF3366", "#2EC4B6"]); // #011627
const colors =  ["#011627", "#FDE74C", "#FF3366", "#2EC4B6"]
const color = d3.scaleOrdinal(colors)

const g = d3.select('svg')
    .attr('width', width)  // svg
    .attr('height', height) // svg
    .append('g')  // 
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');  // center sunburst

// Structure data over a full circle, 2pi radians
const partition = d3.partition()
    .size([2 * Math.PI, radius]);

// Prepare the root node
const root = d3.hierarchy(nodeData)
    .sum(function (d) { return d.size }) // Prepare the root node
    .sort(function (a, b) { return b.value - a.value; }); // sort the slices

// Structure data from the root
partition(root);

// Structure the arcs
arc = d3.arc()
    //.startAngle(function (d) { return d.x0 })
    //.endAngle(function (d) { return d.x1 })
    .startAngle(function (d) { d.x0s = d.x0; return d.x0; })
    .endAngle(function (d) { d.x1s = d.x1; return d.x1; })
    .innerRadius(function (d) { return d.y0 + 120 })
    .outerRadius(function (d) { return d.y1 + 120 });

// Defining the arcs
const slice = g.selectAll('g')
    .data(root.descendants())
    .enter().append('g').attr("class", "node"); //another g to group path and text

// Creating tooltips
const tooltip = d3.tip()
    .html(`<div> Hello </div>`);
g.call(tooltip);

/////// ARCS ///////

// Drawing the arcs
slice.append('path')
    .attr("display", function (d) { return d.depth ? null : "none"; })  // hide inner
    .attr("d", arc)
    .style('stroke', colors[0]) //'#fff'  
    .style('stroke-width', '3px')
    .style("fill", function (d) { return color((d.children ? d : d.parent).data.name); })
    //.on("mouseover", tooltip.show)
    //.on("mouseout", tooltip.hide)
//.style("fill", "url(#kitten)");

// Adding text labels
g.selectAll(".node")
    .append("text")
    .attr("transform", function (d) {
        return "translate(" + arc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")";
    }) 
    .attr("dx", "-40")
    .attr("dy", ".5em")
    .text(function (d) { return d.parent ? d.data.name : "" });


const defs = g.append('svg:defs');

// Loop through each slice to create patterns with unique IDs and associate images
slice.each(function (d, i) {
    if (!d.children) {
    const patternId = `pattern-${i}`; // Create a unique pattern ID for each slice
    const imageUrl = `images/${d.data.image}`; // Get the image URL from data

    // Create a pattern for each slice
    const pattern = defs.append("svg:pattern")
        .attr("id", patternId)
        .attr("patternUnits", "userSpaceOnUse")
        .attr("width", 100) // Set the width of the pattern (adjust as needed)
        .attr("height", 100); // Set the height of the pattern (adjust as needed)

    pattern.append("svg:image")
        .attr("xlink:href", imageUrl)
        .attr("width", 100) // Set the width of the image in the pattern (adjust as needed)
        .attr("height", 100); // Set the height of the image in the pattern (adjust as needed)

    // Apply the pattern fill to each arc
    //d3.select(this).select('path')
   //     .style("fill", `url(#${patternId})`);
    //}

        // Apply the pattern fill on hover
        const currentSlice = d3.select(this);

        currentSlice.select('path')
            .on("mouseover", function () {
                currentSlice.select("text").style("display", "none"); // Hide text labels
                d3.select(this).style("fill", `url(#${patternId})`);
                //tooltip.show();
            })
            .on("mouseout", function () {
                d3.select(this).style("fill", function (d) {
                    currentSlice.select("text").style("display", "block"); // Show text labels
                    return color((d.children ? d : d.parent).data.name);
                });
                //tooltip.hide();
            });
        }
});

// Function to rotate text 
function computeTextRotation(d) {
    var angle = (d.x0 + d.x1) / Math.PI * 90;  // <-- 1

    // Avoid upside-down labels
    return (angle < 90 || angle > 270) ? angle : angle + 180;  // <--2 "labels aligned with slices"

    // Alternate label formatting
    //return (angle < 180) ? angle - 90 : angle + 90;  // <-- 3 "labels as spokes"
}


/////// CENTER ///////

// Append text to the center of the sunburst
g.append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("fill", colors[1])
    .text("Hi, I'm Sunny"); 

// Append a rectangle directly under the text
g.append("rect")
    .attr("x", -70) // Adjust the positioning as needed
    .attr("y", 25) // Adjust the positioning as needed
    .attr("width", 140) // Set the width of the rectangle
    .attr("height", 40) // Set the height of the rectangle
    .attr("rx", 2)
    .attr("ry", 2)
    .attr("fill", colors[3])
    .on("mouseover", function() {
        d3.select(this).attr("fill", colors[1]); // Change color on hover
    })
    .on("mouseout", function() {
        d3.select(this).attr("fill", colors[3]); // Change color back on mouseout
    });
   
g.append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("fill", colors[0])
    .attr("dy", "2em")
    .text("Contact me");  

// Append an image directly under the text
g.append("image")
    .attr("x", 20) // Adjust the positioning as needed
    .attr("y", -35) // Adjust the positioning as needed
    .attr("width", 100) // Set the width of the image
    .attr("height", 30) // Set the height of the image
    .attr("xlink:href", "images/sunlogo.png"); // Specify the path to your image file




///// Tweening Functions
d3.selectAll(".sizeSelect").on("click", function (d, i) {  // <-- 1

    // Determine how to size the slices.
    if (this.value === "size") {  // <-- 2
        root.sum(function (d) { return d.size; });  // <-- 3
    } else {  // <-- 2
        root.count();  // <-- 4
    }
    root.sort(function (a, b) { return b.value - a.value; });  // <-- 5

    partition(root);  // <-- 6

    slice.selectAll("path").transition().duration(750).attrTween("d", arcTweenPath);  // <-- 7
    slice.selectAll("text").transition().duration(750).attrTween("transform", arcTweenText);  // <-- 8

});

function arcTweenPath(a, i) {

    var oi = d3.interpolate({ x0: a.x0s, x1: a.x1s }, a);  // <-- 1
    function tween(t) {  // <-- 2
        var b = oi(t);  // <-- 3
        a.x0s = b.x0;  // <-- 4
        a.x1s = b.x1;  // <-- 4
        return arc(b);  // <-- 5
    }

    return tween;  // <-- 6
}


function arcTweenText(a, i) {

    var oi = d3.interpolate({ x0: a.x0s, x1: a.x1s }, a);
    function tween(t) {
        var b = oi(t);
        return "translate(" + arc.centroid(b) + ")rotate(" + computeTextRotation(b) + ")";
    }
    return tween;
}