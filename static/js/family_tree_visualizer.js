// Copied from https://bl.ocks.org/d3noob/43a860bc0024792f8803bba8ca0d5ecd with minor tweaks

var treeData =
  {
    "name": "Brian Mooney",
    "dob": "16th Jan, 1985",
    "children": [
      {
        "name": "Brendan Mooney",
        "dob": "17th Nov, 1954",
        "children": [
          {
            "name": "Seamus Mooney",
            "dob": "27th Nov, 1927",
            "dod": "21 Mar, 1985",
            "children": [
              {
                "name": "Simon Mooney",
                "dob": "8th Nov, 1893",
                "dod": "18th Sept, 1961",
                "children": [
                  {
                    "name": "Thomas Mooney",
                    "dob": "22nd Jan, 1866",
                    "dod": "2nd Jan, 1900",
                    "children": [
                      {
                        "name": "Simon Mooney",
                        "dob": "1826",
                        "dod": "26th Feb, 1906",
                        "children": [
                          {
                            "name": "James Mooney",
                            "dob": "1787",
                            "dod": "1860",
                            "children": [
                              {
                                "name": "Patrick Mooney",
                                "dob": "1744",
                                "dod": "Sept 7th, 1807"
                              }
                            ]
                          },
                          {
                            "name": "Judith Byrne",
                            "dob": "1794",
                            "dod": "18th Mar, 1844"
                          }
                        ]
                      },
                      {
                        "name": "Mary King",
                        "dob": "1st Jul, 1825",
                        "dod": "5th Mar, 1872",
                        "children": [
                          {
                            "name": "Nicholas King",
                            "dod": "unknown",
                            "children": [
                              {
                                "name": "Bryan King",
                                "dob": "1751",
                                "dod": "10th Jan, 1821",
                                "children": [
                                  {
                                    "name": "Nicholas King",
                                    "dob": "1726",
                                    "dod": "22nd Feb, 1800"
                                  },
                                  {
                                    "name": "Judith Duffey",
                                    "dob": "1720",
                                    "dod": "15th May, 1790"
                                  }
                                ]
                              },
                              {
                                "name": "Anne Branagan",
                                "dob": "1758",
                                "dod": "Oct 6th, 1796"
                              }
                            ]
                          },
                          {
                            "name": "Mary Carolan",
                            "dob": "1791",
                            "dod": "12th April, 1872"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "name": "Mary Reynolds",
                    "dob": "12th Jul, 1868",
                    "dod": "1962",
                    "children": [
                      {
                        "name": "Joseph Reynolds",
                        "dod": "unknown"
                      },
                      {
                        "name": "Mary Reynolds",
                        "dod": "unknown"
                      }
                    ]
                  }
                ]
              },
              {
                "name": "Mary Leonard",
                "dod": "unknown"
              }
            ]
          },
          {
            "name": "Margaret (Peg) Needham",
            "dob": "8th Aug, 1925",
            "dod": "27th Oct, 1999",
            "children": [
              {
                "name": "John Needham",
                "dob": "19th Oct, 1900",
                "dod": "27th Jan, 1943",
                "children": [
                  {
                    "name": "John Needham",
                    "dob": "1879",
                    "dod": "unknown"
                  },
                  {
                    "name": "Margaret Brennan",
                    "dob": "1880",
                    "dod": "unknown"
                  }
                ]
              },
              {
                "name": "Ann Johnson",
                "dod": "unknown"
              }
            ]
          }
        ]
      },
      {
        "name": "Anne Corcoran",
        "dob": "28th Mar, 1956",
        "children": [
          {
            "name": "Martin Corcoran",
            "dob": "17th Apr, 1915",
            "dod": "Oct 3rd, 1986",
            "children": [
              {
                "name": "Willie Corcoran",
                "dob": "1873",
                "dod": "unknown"
              },
              {
                "name": "Bridgette Tanner",
                "dod": "unknown"
              }
            ]
          },
          {
            "name": "Dora Connell",
            "dob": "1st Mar, 1918",
            "dod": "21st Aug, 1996",
            "children": [
              {
                "name": "Kieran Connell",
                "dob": "5th Sept, 1870",
                "dod": "unknown",
                "children": [
                  {
                    "name": "Daniel Connell",
                    "dob": "1841",
                    "dod": "23rd May, 1912",
                    "children": [
                      {
                        "name": "Kieran Connell",
                        "dod": "unknown",
                      }
                    ]
                  },
                  {
                    "name": "Dora Guinan",
                    "dod": "unknown",
                    "children": [
                      {
                        "name": "Velentin Guinan",
                        "dod": "unknown",
                      }
                    ]
                  }
                ]
              },
              {
                "name": "Annie Kelly",
                "dod": "unknown"
              }
            ]
          }
        ]
      }
    ]
  };

// Set the dimensions and margins of the diagram
var margin = {top: 20, right: 90, bottom: 30, left: 90},
    width = 5000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#family_tree").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate("
          + margin.left + "," + margin.top + ")");

var i = 0,
    duration = 750,
    root;

// declares a tree layout and assigns the size
var treemap = d3.tree().size([height, width]);

// Assigns parent, children, height, depth
root = d3.hierarchy(treeData, function(d) { return d.children; });
root.x0 = height / 2;
root.y0 = 0;

// Start with fully collapsed tree
collapse(root);
//root.children.forEach(collapse);

update(root);

// Collapse the node and all it's children
function collapse(d) {
  if(d.children) {
    d._children = d.children
    d._children.forEach(collapse)
    d.children = null
  }
}

function update(source) {

  // Assigns the x and y position for the nodes
  var treeData = treemap(root);

  // Compute the new tree layout.
  var nodes = treeData.descendants(),
      links = treeData.descendants().slice(1);

  // Normalize for fixed-depth.
  nodes.forEach(function(d){ d.y = d.depth * 180});

  // ****************** Nodes section ***************************

  // Update the nodes...
  var node = svg.selectAll('g.node')
      .data(nodes, function(d) {return d.id || (d.id = ++i); });

  // Enter any new modes at the parent's previous position.
  var nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr("transform", function(d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
    })
    .on('click', click);

  // Add Circle for the nodes
  nodeEnter.append('circle')
      .attr('class', 'node')
      .attr('r', 1e-6)
      .style("fill", function(d) {
          return d._children ? "lightsteelblue" : "#fff";
      });

  // Add the person dialog
  function nodeColor(d){
  	if('dod' in d.data) {
  		return 'crimson';
    } else {
  		return 'aquamarine';
  	}
  }

  function nodeCursor(d){
    if('children' in d.data) {
      return 'pointer';
    } else {
      return 'default';
    }
  }

  nodeEnter
    .append('rect')
    .attr('width', 150)
    .attr('height', 80)
    .attr('x', -20)
    .attr('rx', 15)
    .attr('y', -20)
    .attr('cursor', nodeCursor)
    .style('fill', nodeColor)
    .attr('stroke', 'black');

  var txtContainer = nodeEnter
    .append('text')
      .attr("x", -15)
      .attr("y", -15)

  txtContainer
    .append("tspan")
      .attr("x", 0)
      .attr("dy", "1.2em")
      .text(function(d) {
        return d.data.name;
      })
  txtContainer
    .append("tspan")
      .attr("x", 0)
      .attr("dy", "1.2em")
      .text(function(d) {
        if (d.data.dob) {
          return  "B: " + d.data.dob;
        }
      })
  txtContainer
    .append("tspan")
      .attr("x", 0)
      .attr("dy", "1.2em")
      .text(function(d) {
        if (d.data.dod && d.data.dod != "unknown") {
          return "D: " + d.data.dod;
        }
      })

  // UPDATE
  var nodeUpdate = nodeEnter.merge(node);

  // Transition to the proper position for the node
  nodeUpdate.transition()
    .duration(duration)
    .attr("transform", function(d) {
        return "translate(" + d.y + "," + d.x + ")";
     });

  // Update the node attributes and style
  nodeUpdate.select('circle.node')
    .attr('r', 10)
    .style("fill", function(d) {
        return d._children ? "lightsteelblue" : "#fff";
    })
    .attr('cursor', 'pointer');


  // Remove any exiting nodes
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) {
          return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

  // On exit reduce the node circles size to 0
  nodeExit.select('circle')
    .attr('r', 1e-6);

  // On exit reduce the opacity of text labels
  nodeExit.select('text')
    .style('fill-opacity', 1e-6);

  // ****************** links section ***************************

  // Update the links...
  var link = svg.selectAll('path.link')
      .data(links, function(d) { return d.id; });

  // Enter any new links at the parent's previous position.
  var linkEnter = link.enter().insert('path', "g")
      .attr("class", "link")
      .attr('d', function(d){
        var o = {x: source.x0, y: source.y0}
        return diagonal(o, o)
      });

  // UPDATE
  var linkUpdate = linkEnter.merge(link);

  // Transition back to the parent element position
  linkUpdate.transition()
      .duration(duration)
      .attr('d', function(d){ return diagonal(d, d.parent) });

  // Remove any exiting links
  var linkExit = link.exit().transition()
      .duration(duration)
      .attr('d', function(d) {
        var o = {x: source.x, y: source.y}
        return diagonal(o, o)
      })
      .remove();

  // Store the old positions for transition.
  nodes.forEach(function(d){
    d.x0 = d.x;
    d.y0 = d.y;
  });

  // Creates a curved (diagonal) path from parent to the child nodes
  function diagonal(s, d) {

    path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`

    return path
  }

  // Toggle children on click.
  function click(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
    update(d);
  }
}