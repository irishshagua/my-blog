---
title: "Family History"
date: 2016-10-12

tags:
- hobbies
- geneology

thumbnailImagePosition: left
autoThumbnailImage: yes
metaAlignment: center
coverImage: https://res.cloudinary.com/irishshagua/image/upload/v1604005462/blog/family-history/familyHistoryCensus_cjudvr.png
coverCaption: "My Lineage"
comments: false
showTags: true
showPagination: true
showSocial: true
showDate: true
summary: "I've been meaning to do a proper family tree for a while"

---

I've wanted to do a proper family tree for years so I finally decided to do it. It is primarily aimed at the kids and as such will feature both my side and Lings family. Most of the actual research is done at this stage and I've started trying to put what detail I have into a book so that it won't just get lost in the bowels of the internet. I want to document here, the tools and resources that I used and also some of the difficulties that actually presented themselves.

### Research Resources
The below resources are listed in no particular order, but they have all played a big part in the research phase of this project.

* [Guiness Storehouse Archives]
   I was aware that both my Great and 2x Great Grandad worked for Guinness' from having talked to my Dad. He didn't have much information himself about them but thankfully the Guinness storehouse have opened their employee archives to family members. One quick email later and I had an appointment to visit the storehouse (usually a quite expensive [although enjoyable] trip) to rummage through 100 year old documents. The amount of records which the storehouse has is quite impressive when you consider the amount of people who have worked for them. They detail everything from physical evaluations to pension entitlements.

   ![Simon Mooney Guinness Wage Increase]
   **_Simon Mooney Wage Review_**

   ![Thomas Mooney Guinness Post Mortem]
   **_Thomas Mooney Post Mortem Pension Report_**
* [Irish Census Records]
   Most historic Irish census records were pulped after the Government of the day had garnered whatever they found useful from them but there are records from the 1901 and 1911. These have all been digitized and indexed. This makes searching quite easy and can give good detail in terms of location and siblings. As well as the census records, you can also search indexed church records for baptisms and marriages.
   ![Simon Mooney Census]
   **_Simon Mooney 1901 Census Records_**
* [Ancestry Website]
   This was the only paid service that I used during the research and was a bit hit and miss. I think the subscription fees for this site are too high considering that a lot of the indexed searchable data here is freely available on other sites but there definitely is a convenience with being able to search all the data in one place. Also, the site seems to work well when automatically linking to other family trees that exist on the site and recommending possible data that has been indexed against names that exist in your family tree. One feature of the site that I used which I thought was a pile of shite was the DNA research feature. I paid for them to analyse a sample of saliva from my daughter and I wasn't overly happy with the amount of detail which came back. I don't know what I was really expecting but I just felt that the data that was provided off the back of it was a little thin...
   ![Ancestry DNA Analysis]
   **_My Daughters DNA Analysis_**
* Auld People
   Don't for a second underestimate the amount of knowledge and stories which exist only in peoples heads. I was surprised and relieved at the amount of information which i got from great uncles and cousins that simple wasn't documented anywhere. Just remember, when these people are gone, that information is gone too.

### Geneology Tools
To actually build up the tree I looked at a couple of different tools. Because when I started the project I was using both Linux and Windows on a daily basis, a cross platform tool was a real requirement. Now I'm still using Linux but have had to switch to Mac (no I'm not a fan) instead of Windows. One of the tools that I had been looking at was [GeneologyJ]. Because it was Java based, I would get the cross platform abilities for free. It also saved the tree in [GEDCOM] format which meant that if I needed to switch applications, then there would be a transferable format to do so.

```gedcom
   0 @I17@ INDI  
   1 NAME Willie /Corcoran/  
   1 SEX M  
   1 BIRT  
   2 DATE 1873  
   2 PLAC Shannon Harbour, Offaly, Ireland  
   1 FAMS @F8@  
   1 OBJE @M41@  
```
**_GEDCOM Sample_**

 This became quite useful when I was able to simpy upload my exported family tree to the [Ancestry Website] when I was trialling their services. Apart from providing a rich set of different reports which can be run against the family tree (of course the more data that you can store for each member, the better reports you can generate), this tool also gave some very nice visualisations of the family tree.

 ![Sample Family Tree]

 **_Sample Of GeneologyJ Visualisations_**


<!-- Web Links -->
[Guiness Storehouse Archives]: https://www.guinness-storehouse.com/en/archives/archives-catalogue
[Irish Census Records]: https://www.irishgenealogy.ie
[Ancestry Website]: http://www.ancestry.co.uk/
[GeneologyJ]: http://genj.sourceforge.net/
[GEDCOM]: https://en.wikipedia.org/wiki/GEDCOM

<!-- Images -->
[Simon Mooney Guinness Wage Increase]: https://res.cloudinary.com/irishshagua/image/upload/v1604005420/blog/family-history/simonMooneyWageIncreaseGuinness_cdgxn8.jpg
[Thomas Mooney Guinness Post Mortem]: https://res.cloudinary.com/irishshagua/image/upload/v1604005420/blog/family-history/thomasMooneyPostMortemReportGuinness_cre8wo.jpg
[Simon Mooney Census]: https://res.cloudinary.com/irishshagua/image/upload/v1604005420/blog/family-history/simonMooneyCensus_pmgc6a.png
[Ancestry DNA Analysis]: https://res.cloudinary.com/irishshagua/image/upload/v1604005420/blog/family-history/ancestryDnaAnalysis_ciepl3.png
[Sample Family Tree]: https://res.cloudinary.com/irishshagua/image/upload/v1604005420/blog/family-history/sampleFamilyTree_fui2wv.png