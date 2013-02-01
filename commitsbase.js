// Find the element where the commit timeline should be drawn
var commits = d3.select("#commits");

var orgName = commits.attr("orgName") || "JavaPosseRoundup";
var startDate = commits.attr("startDate") || "";
var leftRightPadding = commits.attr("left-right-padding") || 20;
var topBottomPadding = commits.attr("top-bottom-padding") || 150;
var width = commits.attr("width") || $(document).width() - leftRightPadding;
var height = commits.attr("height") || $(window).height() - topBottomPadding;
var leftMargin = commits.attr("left-margin") || 180;
var rightMargin = commits.attr("right-margin") || 0;
var topMargin = commits.attr("top-margin") || 20;
var bottomMargin = commits.attr("bottom-margin") || 60;

var w = width - leftMargin - rightMargin,
    h = height - topMargin - bottomMargin;

// Scales. Note the inverted domain for the y-scale: bigger is up!
var x = d3.time.scale().rangeRound([0, w]),
    y = d3.scale.ordinal().rangePoints([0, h], .5),
    colors = d3.scale.category20();

// Axes.
var xAxis = d3.svg.axis().scale(x).tickSubdivide(true);
var yAxis = d3.svg.axis().scale(y).tickSize(0).tickPadding(5).orient("left");

// Add an SVG element with the desired dimensions and margin.
var svg = commits.append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + leftMargin + "," + topMargin + ")");

// Add the clip path.
svg.append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", w)
    .attr("height", h);

// Need something in the background absorb the mouse events!
svg.append("rect")
    .attr("width", w)
    .attr("height", h)
    .style("fill-opacity", ".0");

function drawChart(allCommits, timelines) {

  var tickHeight = height / (timelines.length * 4 + 1);

  var earliestCommitDate = d3.min(timelines, function(d) { return d.earliest; });

  var start = d3.time.format("%Y-%m-%d").parse(startDate) || earliestCommitDate;

  x.domain([d3.time.day.floor(start), d3.time.day.ceil(new Date())]);

  y.domain(timelines.map(function(t) { return t.repo; }));

  // Add the x-axis.
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (h + topMargin + tickHeight) + ")")
    .call(xAxis);

  // Add the y-axis.
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  svg.selectAll(".commit")
      .data(allCommits)
    .enter().append("line")
      .attr("class", "commit")
      .attr("clip-path", "url(#clip)")
      .attr("x1", function(d) { return x(d.commitDate); })
      .attr("y1", function(d) { return Math.floor(y(d.repo)) - tickHeight; })
      .attr("x2", function(d) { return x(d.commitDate); })
      .attr("y2", function(d) { return Math.floor(y(d.repo)) + tickHeight; })
      .style("stroke", function(d) { return colors(d.committerEmail); })
      .on("mouseover", showCommitInfo);

  svg.selectAll(".timeline")
      .data(timelines)
    .enter().append("line")
      .attr("class", "timeline")
      .attr("clip-path", "url(#clip)")
      .attr("x1", function(d) { return x(d.earliest); })
      .attr("y1", function(d) { return Math.floor(y(d.repo)); })
      .attr("x2", function(d) { return x(d.latest); })
      .attr("y2", function(d) { return Math.floor(y(d.repo)); });

  svg.call(d3.behavior.zoom().x(x).on("zoom", zoom));

  function zoom() {
    svg.select(".x.axis").call(xAxis);
    svg.selectAll(".commit")
      .data(allCommits)
      .attr("x1", function(d) { return x(d.commitDate); })
      .attr("x2", function(d) { return x(d.commitDate); });
    svg.selectAll(".timeline")
      .data(timelines)
      .attr("x1", function(d) { return x(d.earliest); })
      .attr("x2", function(d) { return x(d.latest); });
    svg.selectAll(".committer, .message")
      .attr("x", function(d) { return x(d.commitDate); });
  }

  function showCommitInfo(d, i) {

    var committer = svg.selectAll(".committer")
      .data([d], function(d) { return d.sha; });

    committer.enter().append("text")
      .attr("class", "committer")
      .attr("x", x(d.commitDate))
      .attr("y", y(d.repo))
      .attr("dx", -2)
      .attr("dy", 2 * tickHeight + 5)
      .attr("text-anchor", "end")
      .style("fill", colors(d.committerEmail))
      .text(d.committerName);

    committer.exit().remove();

    var message = svg.selectAll(".message")
      .data([d], function(d) { return d.sha; });

    message.enter().append("text")
      .attr("class", "message")
      .attr("x", x(d.commitDate))
      .attr("y", y(d.repo))
      .attr("dx", 2)
      .attr("dy", 2 * tickHeight + 5)
      .text(d.message);

    message.exit().remove();
  }

}
