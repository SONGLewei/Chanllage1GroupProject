import * as d3 from 'd3';

class ParallelCoordinatesD3 {
    margin = {top: 40, right: 10, bottom: 10, left: 0};
    size; height; width; svg;

    constructor(el){
        this.el = el;
    };

    create = function (config) {
        this.size = {width: config.size.width, height: config.size.height};
        this.width = this.size.width - this.margin.left - this.margin.right;
        this.height = this.size.height - this.margin.top - this.margin.bottom;

        this.svg = d3.select(this.el).append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    }

    renderVis = function (visData) {
        if (!visData || visData.length === 0) return;
        this.svg.selectAll("*").remove();

        const dimensions = ["householdSize", "haveKids", "age", "educationLevel", "joviality"];

        const color = d3.scaleOrdinal()
            .domain(["Low", "HighSchoolOrCollege", "Bachelors", "Graduate"])
            .range(["#440154ff", "#21908dff", "#fde725ff", "#fca50aff"]);

        const y = {};
        for (let i in dimensions) {
            let name = dimensions[i];
            if (typeof visData[0][name] === "number") {
                y[name] = d3.scaleLinear()
                    .domain(d3.extent(visData, d => +d[name]))
                    .range([this.height, 0]);
            } else {
                const categories = Array.from(new Set(visData.map(d => d[name])));
                y[name] = d3.scalePoint()
                    .domain(categories)
                    .range([this.height, 0]);
            }
        }

        const x = d3.scalePoint()
            .range([0, this.width])
            .padding(1)
            .domain(dimensions);

        function path(d) {
            return d3.line()(dimensions.map(p => { 
                return [x(p), y[p](d[p])]; 
            }));
        }

        this.svg.selectAll(".myPath")
            .data(visData)
            .join("path")
            .attr("class", "myPath")
            .attr("d", path)
            .style("fill", "none")
            .style("stroke", d => color(d.educationLevel))
            .style("opacity", 0.5)
            .style("stroke-width", 1.5);

        this.svg.selectAll("myAxis")
            .data(dimensions).enter()
            .append("g")
            .attr("transform", d => "translate(" + x(d) + ")")
            .each(function(d) { 
                d3.select(this).call(d3.axisLeft().scale(y[d])); 
            })
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", -15)
            .text(d => d)
            .style("fill", "black")
            .style("font-weight", "bold");
    }

    clear = function(){
        d3.select(this.el).selectAll("*").remove();
    }
}
export default ParallelCoordinatesD3;