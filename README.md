# Introduction

This project is an experiment in visualizing code development using the amazing [D3][d3home] JavaScript library and the github REST [API][githubapi].

It was conceived at the 2012 Java Posse [Roundup][roundup], an amazing gathering of talented developers from around the world. The developers at the Roundup used [github][github] to collaborate on many different interesting projects - too many for any one person to fully participate in.

[I][githubmtye] was consequently inspired to see if I could use the D3 JavaScript library to create a [visualization][visarticle] of all the work the Roundup developers had accomplished (or at least all the work they'd committed to [github][githubjpr]). This project is the result.

More information is available at the d3github [project page][d3githubpage].

[d3home]: http://d3js.org/ "D3 (Data-Driven Documents) website"
[githubapi]: http://developer.github.com/v3/
[roundup]: http://www.mindviewinc.com/Conferences/JavaPosseRoundup/
[github]: https://github.com/ "Duh!"
[githubmtye]: https://github.com/mtye
[visarticle]: http://en.wikipedia.org/wiki/Information_visualization
[githubjpr]: https://github.com/JavaPosseRoundup "Java Posse Roundup at github"
[d3githubpage]: http://javaposseroundup.github.com/d3github/

## Installation and Use

To use this project, simply clone this github repository and open the ```commits.html``` file in your web browser. (The file references CDN-hosted versions of the D3 and jQuery libraries, so you'll need an Internet connection.)

## Examples

A live example of the d3github visualizer can be found on the d3github [project page][d3githubpage].

## Compatibility

The D3 library uses the CSS Selectors API Level 1 and SVG, which may not be supported in older browsers. This code in this project has been verified to work with Google Chrome (verison 17.0), Firefox (11.0), and Safari (5.1), but not with Internet Explorer. The minimum versions that _should_ work are Chrome 4.0, Firefox 3.5, Safari 3.2, and Internet Explorer 9.0.