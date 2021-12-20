---
title: "Family Tree Visualization"
date: 2021-12-20

tags:
- hobbies
- geneology
- work

thumbnailImagePosition: left
autoThumbnailImage: yes
metaAlignment: center
coverImage: https://res.cloudinary.com/irishshagua/image/upload/v1640002449/blog/family-history/MellifontDroghedaToLiverpool_nps0v7.jpg
coverCaption: "Nautical Family Ties - I will document them someday..."
comments: false
showTags: true
showPagination: true
showSocial: true
showDate: true
summary: "Family Tree Visualized with D3 JavaScript Library"
gallery:
- https://res.cloudinary.com/irishshagua/image/upload/v1640000847/blog/family-history/LifeOnTheFarm_obkwz8.jpg "Life on the Farm 🚜"
- https://res.cloudinary.com/irishshagua/image/upload/v1640000847/blog/family-history/DadHippy_drlepb.png "My Dad in his Youth 🤯"
- https://res.cloudinary.com/irishshagua/image/upload/v1640000848/blog/family-history/SeamusMooney_ntdgzm.png "My Grandfather's Service 🪖"
- https://res.cloudinary.com/irishshagua/image/upload/v1604005462/blog/family-history/familyHistoryCensus_cjudvr.png "Census Records 📄"
- https://res.cloudinary.com/irishshagua/image/upload/v1640000399/blog/family-history/FamilyTreeVisualization_j3ne96.png "D3 Visualization 📊"
- https://res.cloudinary.com/irishshagua/image/upload/v1640000847/blog/family-history/PegMooneyOnLeft_y9c3er.jpg "My Grandmother on the left 👵"
- https://res.cloudinary.com/irishshagua/image/upload/v1640000847/blog/family-history/KoreanWar_hvosny.png "My Wife's Family Service History 🪖"
- https://res.cloudinary.com/irishshagua/image/upload/v1640000847/blog/family-history/MartianAndKathleenAndWillieCorcoranAndBridgetteTanner_bpha7o.jpg "Old Family Snaps 🖼️"
---

I have another [blog entry]({{< ref "/content/post/family-history.md" >}}) documenting some of the tools that I've used in the past while researching/collecting data related to my Family tree. This entry will focus a little more on using the [D3.js](https://d3js.org/) library to build a nice little interactive visualization of that Tree.

Anyways, I was recently involved in a mini hackathon in work...
{{< tweet user="irishshagua" id="1471559324942180354" >}}
...and one of the other teams used the D3 JS [Collapsible Diagram example](https://bl.ocks.org/d3noob/43a860bc0024792f8803bba8ca0d5ecd) to build a simple product hierarchy viewer. I liked the idea and thought it would work well as a family tree display.

## Details
Building the visualization was actually pretty easy (well... let's say robbing the work that had already been done by others and slightly tweaking it). The [D3 script](/js/family_tree_visualizer.js) does everything. Embedding in the blog was relatively simple through the construction of a hugo [shortcode](https://gohugo.io/content-management/shortcodes/). The hardest part was figuring out how to get the text to display in the [SVG rectangles](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/rect). Ideally this should have been done using a `foreignObject` but I had some issues getting this working so just did a positional fudge in the svg attributes. This will of course break dependening on text size etc, but it seemed fne for such a trivial visualization.

## Visualziation
{{< family_tree_visualization >}}

## Gallery
And here's a few photos from the Family Tree research. I think it's great to have a view of peoples (some of whom I've never even met, or only met before I could walk & talk) lives from a different time. It's one of the things about my researching my genealogy that I find most interesting.