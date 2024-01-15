export function size() {
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
}

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

