---
title: "Dynamic Site Features"
date: 2020-11-06

tags:
- work

thumbnailImagePosition: left
autoThumbnailImage: yes
metaAlignment: center
coverImage: https://res.cloudinary.com/irishshagua/image/upload/v1604695866/blog/DynamicSite/Sunrise_jnhl0a.jpg
coverCaption: "Up-Skill Static Sites"
comments: false
showTags: true
showPagination: true
showSocial: true
showDate: true
summary: "Adding dynamic features to a static GitHub pages site"

---

My brother and myself have been stupidly trying to drink in every pub in Dublin for a while. For every pub that we get, we write a little review (usually drunkenly) and to ensure we don't lose all the info, I have it stored in a [GitHub repo]. We've a [little site] done to view  the pubs and reviews on a map. Using [GitHub pages] makes it easy to host a site, and the best part is it's completely free. That's all well and good, but as a static site it can be fairly limited. There's a sprinkling of JavaScript in the site to load the pubs from the above mentioned GitHub repo, which at least means that there's no need to rebuild the site to view a new pub on the map, but functionality like adding new pubs isn't really possible within the feature set of GitHub pages. I was trying to figure out a nice way to add a form to give the ability to add a new pub and review to the list.

![GAS Lambda]
**_Google App Script_**    
As per the architecture diagram, the [code for a Google App Script web app] is stored in GitHub. Any pushes to this repo kicks off a GitHub Actions pipeline which ultimately publishes the code to Google App Script. This is done using a GAS development tool called [clasp]. With the Google App Script deployed, it's possible to invoke the web script via a Post request, which can be added as the endpoint for a form in our static site... Great... But wait... We don't want just anyone adding a review to our pub list, and our GitHub pages site has zero authentication mechanisms available to it. Well, the great thing about the web script running in Google App Script is that you need to be signed in to your google account to invoke it, and it's restricted to just my account :D.

![GAS Lambda Dashboard]
**_Dashboard_**    
There are some other nice features like simple invocation graphs and access to any lambda logging from the [Google App Script] site. There are of course limits on number of invocations, which is completely understandable for a free service. But unless I'm on an absolute fuckin bender, I doubt I'll breach the daily limits.

![View of the pub list]
**_Pub List_**    
So now we have a nice way to add pubs to the list from the site... And the best thing is, it's all free. This is great considering I'm an awful cheap bastard...

<!-- Web Links -->
[little site]: https://irishshagua.github.io/dublin-pubs-map
[GitHub repo]: https://github.com/irishshagua/dublin-pubs-map
[GitHub pages]: https://pages.github.com/
[code for a Google App Script web app]: https://github.com/irishshagua/DublinPubLisher
[clasp]: https://github.com/google/clasp
[Google App Script]: https://script.google.com/

<!-- Images -->
[GAS Lambda]: https://res.cloudinary.com/irishshagua/image/upload/v1604694571/blog/DynamicSite/DynamicSiteAbilities_dok03d.png
[GAS Lambda Dashboard]: https://res.cloudinary.com/irishshagua/image/upload/v1604695319/blog/DynamicSite/Screenshot_2020-11-06_at_20.41.36_u0kpwh.png
[View of the pub list]: https://res.cloudinary.com/irishshagua/image/upload/v1604698249/blog/DynamicSite/ViewOfPubListAndSubmissionForm_eidbtt.png
