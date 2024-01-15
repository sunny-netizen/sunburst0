import { svg, colors } from "./sunburst.js";

export function center() {
    // Append text to the center of the sunburst
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", colors[1])
        .attr("font-size", 30)
        .text("Hi, I'm Sunny");

    // Append sunlogo
    svg.append("image")
        .attr("x", 70) // Adjust the positioning as needed
        .attr("y", -45) // Adjust the positioning as needed
        .attr("width", 35) // Set the width of the image
        .attr("height", 35) // Set the height of the image
        .attr("xlink:href", "images/sunlogo.png"); // Specify the path to your image file

    // Append a rectangle directly under the text
    svg.append("rect")
        .attr("x", -70) // Adjust the positioning as needed
        .attr("y", 25) // Adjust the positioning as needed
        .attr("width", 140) // Set the width of the rectangle
        .attr("height", 40) // Set the height of the rectangle
        .attr("rx", 20)
        .attr("ry", 20)
        .attr("fill", colors[3])
        .on("mouseover", function () {
            d3.select(this).attr("fill", colors[1]); // Change color on hover
        })
        .on("mouseout", function () {
            d3.select(this).attr("fill", colors[3]); // Change color back on mouseout
        })
        .on("click", function () {
            var contactSection = d3.select("#contact").node();
            d3.select("html, body").transition().duration(1000).ease(d3.easeCubicInOut)
                .tween("scroll", scrollTopTween(contactSection.offsetTop));
        })
        .attr("stroke", colors[3])
        .attr("stroke-opacity", 0.3)
        .attr("stroke-width", 5);


    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", colors[0])
        .attr("dy", "2em")
        .text("Contact me");
}


function scrollTopTween(scrollTop) {
    return function () {
        var i = d3.interpolateNumber(window.pageYOffset || document.documentElement.scrollTop, scrollTop);
        return function (t) { scrollTo(0, i(t)); };
    };
}

/*
document.getElementById("myRect").addEventListener("click", function() {
    var contactSection = document.getElementById("contact");
    contactSection.scrollIntoView({ behavior: "smooth" });
});
*/






