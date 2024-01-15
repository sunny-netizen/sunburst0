import {svg, color, slice} from "./sunburst.js";

const defs = svg.append('svg:defs');


export function pattern() {

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

        // Apply the pattern fill on hover
        const currentSlice = d3.select(this);

        currentSlice.select('path')
            .on("mouseover", function () {
                currentSlice.select("text").style("display", "none"); // Hide text labels
                d3.select(this).style("fill", `url(#${patternId})`);//.style("opacity", 1); // Apply the pattern fill
            })
            .on("mouseout", function () {
                d3.select(this).style("fill", function (d) {
                    currentSlice.select("text").style("display", "block"); // Show text labels
                    return color((d.children ? d : d.parent).data.name); // Remove the pattern fill
                })//.style("opacity", 0.2);
            });
        }
});
}