---
title: "Dockerised Project Builds"
date: 2020-10-30

tags:
- work

thumbnailImagePosition: left
autoThumbnailImage: yes
metaAlignment: center
coverImage: https://res.cloudinary.com/irishshagua/image/upload/v1604084070/blog/dockerised-build/fast_jet_yp2sbi.jpg
coverCaption: "Speed up your builds"
comments: false
showTags: true
showPagination: true
showSocial: true
showDate: true
summary: "Relaunching the blog"

---

So I finally got around to adding some more content to the blog.... Kinda. Ok so we're in Covid lockdown 2.0 at the moment, and the kids are off on their mid term break so I took a week off work to try and help out Ling looking after them. After all, everywhere is closed so we don't have many options apart from trying to do stuff around the house. `What's that got to do with your feckin blog?` I hear you ask... Well, seeing as there's no school in the mornings, the kids have comandeered the TV in the evening. We're watching [Gnomeo and Juliet] at the moment... Good soundtrack. Anyways, this means I've got some time on the laptop to mess around with.

When I originally started this blog, it was using Jekyll to generate the site. There was a large gap where I didn't add anything new to the blog and tbh, I kinda forgot how to build the site. I've changed to a chromebook at home recently, as I don't really do much side-project(y) stuff anymore and it's easier for the kids to use, but I couldn't get Jekyll installed properly to even remove a facebook link from the old incarnation of the site (having proudly deleted my facebook account a while back). So I wanted to overhaul the site. Pick a new template, make it easier to build and publish etc etc etc... I had a quick look online and [Hugo] seemed to be a good option. It had a lot of template options and seemed to be easy to use. And the best part, no issues installing Ruby versions... Anyways, it was easy enough to transfer the old posts over to the new hugo format, there really wasn't that many posts to migrate. But I wanted to ensure that I didn't make the same mistake again and potentially forget how to add new posts in the future. Re-learning how to add posts wouldn't be too difficult, but it took me a few minutes to install hugo (longest part was adding homebrew) and I don't want to have to go through that again if I'm on a different computer etc. So having been impressed recently with a dockerised build for [metacontroller] (a project that I use in work), I thought it'd be interesting to see how much effort there'd be in dockerising the hugo install. I have to say, there was __fuck all__ to getting this working. There's now a single bash script in the repository which contains the actual Markdown, and that uses a docker image which exists already on docker hub. So testing local edits is now as simple as running the below:
```bash
docker run --rm -it -v $(pwd):/src -p 1313:1313 klakegg/hugo:0.76.5 server
```
So really impressed with the ease with which it was possible to set this up. Hopefully no concerns about not being able to quickly and easily add content to the blog in future. And dockerising the build environment is definitely something I'm going to look at doing in future for larger projects.

<!-- Web Links -->
[Gnomeo and Juliet]: https://www.imdb.com/title/tt0377981
[Hugo]: https://gohugo.io/
[metacontroller]: https://github.com/metacontroller/metacontroller