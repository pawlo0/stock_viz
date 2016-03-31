# **DRIP Stocks Viz**

Living in https://stocks-viz.herokuapp.com/

# Peer review assigment
### Responsive Website Tutorial and Examples
by University of London, Goldsmiths, University of London

5th Course on the
[Create a Web Experience Specialization](https://www.coursera.org/learn/web-application-development/)

---

The site can have any number of pages as long as there is a clear purpose for each one. It must have the following features.

- Clear navigation allowing the user to move between pages/ functions and to locate relevant information
- Consistent style across the pages through the use of CSS
- Responsive layout where the layout changes depending on the size of the browser window
- Use of Bootstrap
- Clearly stated purpose for each page
- Clear landing page (this might just be a special page that introduces the site, or some instructions)
- It should use data from a different source (i.e. not the music data), visualise it in at least on three ways not covered in the example (using viz.js), and be interactive in some way
 
---

The main goal of this assignment was to take the provided code and use it with a different source and visualise it in different ways than the ones covered during video lessons using the [vis.js](http://visjs.org/) tool.


As expected, the hard part of this assignment was to retrieve and manipulate data. I choose an excel file found in http://www.dripinvesting.org/tools/tools.asp. That implied using the netanelgilad:excel package to parse excel files. Must say it was a good practice for future needs on these package.
Side note, tried to use the collectionFS in order to download the filed automaticaly. But I was getting to many errors so decided to simplify, and put the file in public folder and work from there.
In the future, with more time, I'll deal with the collectionFS.


After that hard task, manipulating vis.js was not so hard, although it took me some time. Mainly because I kept changing my mind about the graphs, looks and interactivity that I would like to present. 


Last, the looks and feels of the page. Never ending job... There is always something one can do to make the site look different.