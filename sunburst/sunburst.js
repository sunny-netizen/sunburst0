// https://denjn5.github.io/ 
// great explanations https://gist.github.com/denjn5/e1cdbbe586ac31747b4a304f8f86efa5
// zoomable https://observablehq.com/@d3/zoomable-sunburst
// widths https://stackoverflow.com/questions/4787527/how-to-find-the-width-of-a-div-using-vanilla-javascript 
// defs https://stackoverflow.com/questions/25881186/d3-fill-shape-with-image-using-pattern

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { nodeData } from './data.js';


// Colors
export const colors =  ["#011627", "#FDE74C", "#FF3366", "#2EC4B6"]
export const color = d3.scaleOrdinal(colors)
export const width = window.innerWidth;
export const height = window.innerHeight;
export let svg, root, arc, slice

sunburst()
export function sunburst() {
    createSVG()
    createRoot()
    createArcs()
}

// creating svg with dynamic dimensions
function createSVG() {
svg = d3.select('svg')
    .attr('width', width)  // svg
    .attr('height', height) // svg
    .append('g')  // 
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');  // center sunburst
}

// Compute the layout
function createRoot () {
root = d3.hierarchy(nodeData)
    .sum(function (d) { return d.size }) // Prepare the root node
    .sort(function (a, b) { return b.value - a.value; }); // sort the slices
const radius = Math.min(width, height) / 2.3; // radius of sunburst
const partition = d3.partition().size([2 * Math.PI, radius]); // Structure data over a full circle, 2pi radians
partition(root);
}

// Structure and render the arcs
function createArcs () {
// Structure the arcs
arc = d3.arc()
    //.startAngle(function (d) { return d.x0 })
    //.endAngle(function (d) { return d.x1 })
    .startAngle(function (d) { d.x0s = d.x0; return d.x0; })
    .endAngle(function (d) { d.x1s = d.x1; return d.x1; })
    .innerRadius(function (d) { return d.y0 + 20 })
    .outerRadius(function (d) { return d.y1 + 20 });

// Data join the arcs
slice = svg.selectAll('g')
    .data(root.descendants())
    .join('g')
    .attr("class", "node"); //another g to group path and text

slice.append('path')
    .attr("display", d => d.depth ? null : "none")  // hide parent
    .attr("d", arc)
    .style('stroke', colors[0]) 
    .style('stroke-width', '3px')
    .style("fill", function (d) { return color((d.children ? d : d.parent).data.name); })
    .attr("opacity", 0.55)
    .on('click', d => window.location.href = d.link);
}