var orgName = "JavaPosseRoundup";
var roundupStart = new Date(2012, 2, 25);

var margin = {top: 20, right: 0, bottom: 50, left: 180},
    w = 1200 - margin.left - margin.right,
    h = 600 - margin.top - margin.bottom,
    tickHeight = 10;

// Scales. Note the inverted domain for the y-scale: bigger is up!
var x = d3.time.scale().rangeRound([0, w]),
    y = d3.scale.ordinal().rangePoints([0, h], .5),
    colors = d3.scale.category20();

// Axes.
var xAxis = d3.svg.axis().scale(x).tickSubdivide(true);
var yAxis = d3.svg.axis().scale(y).tickSize(0).tickPadding(5).orient("left");

// Add an SVG element with the desired dimensions and margin.
var svg = d3.select("#chart").append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Add the clip path.
svg.append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", w)
    .attr("height", h + 20);

// Need something in the background absorb the mouse events!
svg.append("rect")
    .attr("width", w)
    .attr("height", h)
    .style("fill", "#fff");

$.getJSON("https://api.github.com/orgs/" + orgName + "/repos?callback=?", function(response) {
  var allCommits = [];
  var timelines = [];
  $.each(response.data, function(i, repo) {
    function gitSource(repo) {
      return repo.url + "/commits?callback=?";
    }
    $.getJSON(gitSource(repo), function(response) {
      var commits = response.data.map(function(r) {
        return {
          repo: repo.name,
          message: r.commit.message,
          authorDate: d3.time.format.iso.parse(r.commit.author.date),
          committerEmail: r.commit.committer.email,
          committerName: r.commit.committer.name,
          commitDate: d3.time.format.iso.parse(r.commit.committer.date),
          sha: r.sha
        }
      });
      var timeline = {
        repo: repo.name,
        earliest: commits[commits.length - 1].commitDate,
        latest: commits[0].commitDate
      };
      allCommits.push.apply(allCommits, commits);
      timelines.push(timeline);
      if (timelines.length == response.data.length) drawChart(allCommits, timelines);
    });
  });
});

function drawChart(allCommits, timelines) {

  x.domain([roundupStart, d3.time.day.ceil(new Date())]);

  y.domain(timelines.map(function(t) { return t.repo; }));

  // Add the x-axis.
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (h + 20) + ")")
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
      .attr("clip-path", "url(#clip)")
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
      .attr("clip-path", "url(#clip)")
      .attr("x", x(d.commitDate))
      .attr("y", y(d.repo))
      .attr("dx", 2)
      .attr("dy", 2 * tickHeight + 5)
      .text(d.message);

    message.exit().remove();
  }

}
