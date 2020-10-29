# Blog published to [irishshagua.github.io](https://irishshagua.github.io)
Details about my github pages site.

## Tools Used
The blog is deployed as a github organisation page for my account. It's a static site constructed using [hugo](https://gohugo.io/). It's using a publicly available theme called [Tranquil Peak](https://github.com/kakawait/hugo-tranquilpeak-theme). All images that I own are hosted on [cloudinary](https://cloudinary.com/), their free plan seems quite good. I'm not currently linking a submodule in the theme folder as I'm not sure how often I'm going to update the site and I don't want to have to deal with any changes next time I go to update. 

## How to Update
Adding new content is simple.
  1. Add a new markdown file to `content/post`
  1. Test locally using `hugo server` # site will be available on http://localhost:1313
  1. Publish when happy `./deploy.sh`