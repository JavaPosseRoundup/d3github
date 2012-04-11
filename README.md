# Introduction

This project is an experiment in visualizing code development using the amazing [d3][d3home] JavaScript library and the github REST [api][githubapi].

It was conceived at the 2012 Java Posse [Roundup][roundup], an amazing gathering of talented developers from around the world. The developers at the Roundup used [github][github] to collaborate on many different interesting projects - too many for any one person to fully participate in.

[I][githubmtye] was consequently inspired to see if I could use the d3 JavaScript library to create a [visualization][visarticle] of all the work the Roundup developers had accompished (or at least all the work they'd committed to [github][githubjpr]). This is the result.

[d3home]: http://mbostock.github.com/d3/ "d3 at github"
[githubapi]: http://developer.github.com/v3/
[roundup]: http://www.mindviewinc.com/Conferences/JavaPosseRoundup/
[github]: https://github.com/ "Duh!"
[githubmtye]: https://github.com/mtye
[visarticle]: http://en.wikipedia.org/wiki/Information_visualization
[githubjpr]: https://github.com/JavaPosseRoundup "Java Posse Roundup at github"

# Installation and Use

To use this project, simple clone this github repository and open the ```commits.html``` file in your web browser. The d3 library is available in the root directory, so there's no need to install it (or anything else).

# Compatibility

The d3 library uses the CSS Selectors API Level 1 and SVG, which may not be supported in older browsers. This code in this project has been verified to work with Google Chrome (verison 17.0), Firefox (11.0), and Safari (5.1), but not with Internet Explorer. The minimum versions that _should_ work are Chrome 4.0, Firefox 3.5, Safari 3.2, and Internet Explorer 9.0.