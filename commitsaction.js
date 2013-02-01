$.getJSON("https://api.github.com/orgs/" + orgName + "/repos?callback=?", function(response) {
  var allCommits = [];
  var timelines = [];
  response.data.forEach(function(repo, i, array) {
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
      if (timelines.length == array.length) drawChart(allCommits, timelines);
    });
  });
});
