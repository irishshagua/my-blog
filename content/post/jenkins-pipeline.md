---
title: "Jenkins Pipeline"
date: 2017-01-05

tags:
- work
- continuous-delivery

thumbnailImagePosition: left
autoThumbnailImage: yes
metaAlignment: center
coverImage: https://res.cloudinary.com/irishshagua/image/upload/v1604006630/blog/jenkins-pipeline/pipeline_cbrfdj.png
coverCaption: "CD Pipeline"
comments: false
showTags: true
showPagination: true
showSocial: true
showDate: true
summary: "Experimenting with Jenkins pipeline"

---

I've used Jenkins for the last few years, whether that be building personal projects on [OpenShift] or using the [CD pipeline] in the day job. And even though [Jenkins 2.0 was released] back in April of last year, I hadn't taken the time to have a play with it. So after news of the new [Blue Ocean plugin] popped up on my twitter feed, I decided it was time to take a look...

## Updates
First impressions of Jenkins 2.0 were pretty good. Straight off the bat the installation process seems to exemplify a refocus on security and UX, as the first dialog you are presented with requires a pass-phrase which is randomly generated and available in your install logs. After this, the plugin installations screens actually look pretty nice. As much as I've always appreciated the power of Jenkins, it's UI has always looked like it was thrown together as a side thought. Although the UI changes don't really live beyond the installation screens, it's a good sign of what may be to come. And then there's also the Blue Ocean plugin which we'll discuss below.

The other big change is the new DSL for defining automation pipelines. This is what really interested me...

## Jenkins Pipeline
Having a pipeline of tasks which gives you confidence about the code changes you are making is the absolute cornerstone of continuous delivery.

![Pipeline]
**_Pipeline of tasks run on code commit_**

And with the Jenkins pipeline DSL, this is now ridiculously easy. When creating a job in Jenkins now, you can select to create a job per branch for a repository. I tried this out on a [project] that I had in github and the results were pretty cool. To enable the pipeline, you need to have a Jenkinsfile stored in the repo which will define the stages invovled. This Jenkinsfile is a groovy DSL which allows you to select what steps are executed and in what order. It even allows for a pause on the execution to allow humans to say whether or not it's safe to proceed to the next stage.

You can see the syntax for the file below which is a small sample of the commands available. Here, you can see more of the [pipeline commands] which can be used in your descriptor.

```Jenkinsfile
    node {
      def mvnHome
      stage('Preparation') {
        echo("Check out branch and setup build pipeline environment")
        checkout scm
        mvnHome = tool 'M3'
      }
   
      stage('Compile') {
        echo("Check for compilation issues")
        sh "'${mvnHome}/bin/mvn' clean compile"
      }
   
      stage('Test') {
        echo("Execute Unit tests")
        sh "'${mvnHome}/bin/mvn' test"
        junit '**/target/surefire-reports/TEST-*.xml'
      }
   
      stage('Validate') {
        sh "'${mvnHome}/bin/mvn' -DskipTests install"
        parallel('Code Coverage': {
          sh "'${mvnHome}/bin/mvn' jacoco:check"
        }, 'Style Check': {
          sh "'${mvnHome}/bin/mvn' checkstyle:checkstyle"
        }, 'Find Bugs': {
          sh "'${mvnHome}/bin/mvn' findbugs:check"
        })
      }

      stage('Build') {
        sh "'${mvnHome}/bin/mvn' -DskipTests package"
      }

      stage('Deploy') {
        input "Happy to deploy or what?"
      }
    }
```

![Jenkins Old Pipeline View]
**_How the Jenkinsfile manifests itself in the Jenkins UI_**

Another great thing about having the Jenkinsfile in the source control is that you can change the file on your feature branch to add in any extra build steps that may be required as part of whatever new feature you are trying to land. If you are using a multi branch job in Jenkins, then a new branch in the repo will automatically be created as a new pipeline and proceed with the build according to the Jenkinsfile as part of that branch.

The features even stretch as far as integrating with the pull request lifecycle in github, similar to how [Travis CI] is currently used to confirm that a build is stable before allowing the possibility to merge to master.

![Pipeline Github Integration]
**_GitHub Pull Request Integration_**


## Blue Ocean Plugin
As I mentioned at the start of this post, it was the [Blue Ocean plugin] which prompted me to look at Jenkins 2. And to be honest, the UI which you get from the plugin looks absolutely beautiful.

![Blue Ocean Repo View]
**_New Blue Ocean UI_**

That's not to say that it's perfect though. There are some issues that I found while doing my very limited exploration. For instance, the confitional step which is defined in the Deploy stage of the above Jenkinsfile doesn't seem to be actionable from the blue ocean UI. Also, it did randomly freeze up on stage transitions but I'm probably being harsh seeing as the plugin is still only Beta. As a way to get a nice dashboard view of your repo, it seems to be very good indeed and I have to admit, I do like the idea of giving Jenkins a bit of a spit polish.

![Blue Ocean Dashboard View]
**_Meta information associated with pipeline executions_**



<!-- Weblinks -->
[OpenShift]: https://www.openshift.com
[CD pipeline]: https://www.infoq.com/articles/cd-benefits-challenges
[Jenkins 2.0 was released]: https://jenkins.io/blog/2016/04/26/jenkins-20-is-here/
[Blue Ocean plugin]: https://jenkins.io/projects/blueocean/
[project]: https://github.com/irishshagua/dublin-pubs-rankings-rest-service
[pipeline commands]: https://jenkins.io/doc/pipeline/steps/
[Travis CI]: https://travis-ci.org/

<!-- Images -->
[Pipeline]: https://res.cloudinary.com/irishshagua/image/upload/v1604006630/blog/jenkins-pipeline/pipeline_cbrfdj.png
[Jenkins Old Pipeline View]: https://res.cloudinary.com/irishshagua/image/upload/v1604006630/blog/jenkins-pipeline/jenkinsOldPipelineView_ilxatj.png
[Blue Ocean Repo View]: https://res.cloudinary.com/irishshagua/image/upload/v1604006630/blog/jenkins-pipeline/blueOceanRepoView_c8w0h0.png
[Blue Ocean Dashboard View]: https://res.cloudinary.com/irishshagua/image/upload/v1604006630/blog/jenkins-pipeline/blueOceanDashboardView_zjh6dj.png
[Pipeline Github Integration]: https://res.cloudinary.com/irishshagua/image/upload/v1604006630/blog/jenkins-pipeline/githubIntegration_gw7kqf.png