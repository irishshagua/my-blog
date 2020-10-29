---
title: "NodeJs v Java IO Comparison"
date: 2016-10-31

tags:
- work
- java

thumbnailImagePosition: left
autoThumbnailImage: yes
metaAlignment: center
coverImage: https://res.cloudinary.com/irishshagua/image/upload/v1604006064/blog/JavaNodePerfComp/javaPerf_z8dtr3.jpg
coverCaption: "Benchmarking"
comments: false
showTags: true
showPagination: true
showSocial: true
showDate: true
summary: "Comparing IO performance of Java and NodeJS"

---

A colleague in work recently did a '*lunch and learn*' around, how as a development department, we have become too _**enterprisey**_... The definition of *enterprisey* was basically that we are too slow to deliver smaller services which act as a glue for some of the larger projects that we work on. Stuff like simple CRUD or config services. I agreed with a lot of what he said around trying to be more lean while delivering these things, and while a lot of the problems which slow a dev team, or even a single developer, from delivering these important but often small and relatively trivial projects are out of the control of the developers (I'm thinking environment provisioning, security auditing, monitoring and prod support agreements), many things that we do could be a lot simpler. 

One thing that he mentioned during his talk that I couldn't let slip was using the right tool for the job. [NodeJs] was put forward as an alternative solution for how we deliver things but one of his main points was that the IO performance of NodeJS (due to its event loopy nature) blows Java out of the water.... Did someone mention :fire: :fire: flame war :fire: :fire:??? Just to be clear, I am not writing this as an attack on NodeJs. I fully agreed with some of the points he made about the simplicity of writing apps in JavaScript. The vibrancy of the Node community and the ease of finding small libraries from [npm] are all great benefits. But I just couldn't let it slip the statement that Java (or more importantly the JVM) couldn't offer the same performance as Node. So I decided to do a little experiment. One small application written in both JavaScript and Java. A simple REST service backed by a MySQL DB. A fight to the death to see if Nodes event loop would actually blow the JVM away...

### The Problem
We have a MySQL DB which contains locations and ratings for Pubs (what else... ). We want a simple REST service to query the pubs and return them as JSON. The service should expose three endpoints:
   
   1. '/'          :- which just gives a simple plain text response
   2. '/pubs'      :- which queries all the pubs in the DB and returns as JSON with the appropriate header
   3. '/pubs/{id}' :- which returns the JSON for a single pub with the appropriate header

Using a simple jmeter script we will test each of the calls a number of times for 100 concurrent users.

### The Test Enviornment
To try and validate which app performed better I wanted the test to be as fair as possible. By running the app server inside of an EC2 isntance on AWS I could at least guarantee that there was nothing running on my laptop which would spoil the results. And seeing as the app server was in the :cloud:, it only made sense to host the DB there too... This gave me an opportunity to try out [Amazon RDS] whcih was pretty cool. In the space of a few minutes I had a MySQL DB (well it was actually an Amazon Aurora DB, but I think it's basically MySQL) up and waiting for some requests. I created a very simple schema with only one table:

```sql   
    CREATE TABLE `pub` ( 
         `id` int(11) NOT NULL AUTO_INCREMENT, 
         `name` varchar(40) NOT NULL,  
         `latitude` double NOT NULL,  
         `longitude` double NOT NULL,  
         `review` varchar(1000) NOT NULL,  
          PRIMARY KEY (`id`)  
    ) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1
```

The UI for RDS is actually pretty cool. You get simple monitoring and metrics out of the box. The only difficult part was getting access between the DB and the app server, but this was down to my own rushed stupidity. I hadn't built them in the same VPC so couldn't give access to the security group which the app server resided in. One quick re-create of the VM (and a few pennys extra into Amazons coffers) and we were ready to rock.

 ![RDS Dashboard]

 **_RDS Dashboard_**

### Node JS Event Loop
Before going into the details of the apps it's probably a good idea to give a bit of background as to why it was suggested that NodeJS would be better at supporting a service which was more IO intensive than CPU intensive. NodeJS as many will tell you is single threaded. While there are some useful libs which enable you to create more processes for executing your JS code, typically all of your JS will be executed in one thread. So how come NodeJS can achieve very decent IO performance? NodeJS operates on an event loop which can delegate out IO tasks to seperate threads which are managed by the underlying C++ libs. The actual blocking of the thread happens in this low level land and when that is complete, a callback is made into JS land with the results. I'm not going to go into detail about it here but there's a [great blog post from Alexander Kasiuk] explaining this in more detail.

 ![NodeJS Event Loop]

 **_NodeJS Event Loop_**

### The Apps
To start with a compliment, the [NodeJS version] of the app is definitely more concise than the [Java version]. At only 49 lines of code, it's possible to get a very basic app which can serve traffic from the DB. Compared to Javas 93 lines, it's pretty much half the code. Although both could be wrote in less, it was really the intent here. It does seem fair to highlight that whatever you write in Node, it's probably gonna be less verbose than the Java equivalent. We'll save the comparisons between alternate JVM langs for a different post...
The Node app is made up of only two files, seperated by responsibility. One is responsible for serving the HTTP traffic and the other is responsible for the data access. You can see from the below snippet how simple it is to actually instantiate a server using one of the *many* libs available.

```javascript
    var express = require('express');
    var app = express();
    var dao = require('./dao');

    app.get('/pubs', function (req, res) {
	  dao.getAllPubs(function(dbResult) {
		res.json(dbResult);
	  });
    });

    var server = app.listen(8080, function () {
      console.log("App started. Listening on http://localhost:8080");
    });
```

 **_NodeJS Server Snippet_**

But it is possible to setup the same kind of async server using Java libs like the wonderful [Undertow]. To try and stay consistant across the two apps, I've split them the exact same so there are two Java classes, one responsible for serving HTTP requests and the other responsible for DB access. The only difference is that the model for the Java app lives in a seperate file. This is obviously a benefit of every object already existing as JSON in JS land.

```java
public static void main(String... args) {
      PathTemplateHandler handler = new PathTemplateHandler();

      handler.add("/pubs", Server::getAllPubs);

      Undertow server = Undertow.builder()
        .addHttpListener(8080, "0.0.0.0")
        .setHandler(handler)
        .build();

      server.start();
    }
  
    private static void getAllPubs(final HttpServerExchange exchange) {
      if (exchange.isInIoThread()) {
        exchange.dispatch(() -> {
          List<Pub> pubs = new DBQuery().getAllPubs();
          exchange.getResponseHeaders().put(Headers.CONTENT_TYPE, "application/json");
          exchange.getResponseSender().send(GSON.toJson(pubs));
        });
      }
    }
```

 **_Java Server Snippet_**

### The Results
So how do the apps stack up against each other? Actually, they were pretty close in terms of performance. Bearing in mind that these are both extremely simplistic apps and could both probably be optimised, I think it's a fair conclusion to draw from the below results that the initial statement NodeJS would blow that Java out of the water was a bit premature. It is very possible to write asynchronous code which runs on the JVM, and hopefully the code ([which is available on github]) shows that it is not particularly difficult to do that. The results below are so close that it is nearly negligible to declare a winner. The same worker thread delegation can be achieved in both languages so it really comes down to experience, preference etc.. as to which you should choose.

**_Node Results_**
| Request        |  Avg Resp Time (ms) | Min REsp Time (ms) | Max Resp Time (ms) | Throughput (req/s) | Avg Payload Size (Bytes) |
| ---------------|:-------------------:|:------------------:|:------------------:|:------------------:|:------------------------:|
| Landing Page   | 35                  | 9                  | 156                | 291.5              | 222                      |
| Get All Pubs   | 35                  | 11                 | 162                | 292.5              | 763                      |
| Get Single Pub | 36                  | 11                 | 135                | 294.4              | 319.5                    | 
| Totals         | 35                  | 9                  | 162                | 870.3              | 434.8                    |



**_Java Results_**
| Request        |  Avg Resp Time (ms) | Min REsp Time (ms) | Max Resp Time (ms) | Throughput (req/s) | Avg Payload Size (Bytes) |
| ---------------|:-------------------:|:------------------:|:------------------:|:------------------:|:------------------------:|
| Landing Page   | 24                  | 9                  | 127                | 313                | 116                      |
| Get All Pubs   | 25                  | 9                  | 241                | 316                | 692                      |
| Get Single Pub | 24                  | 9                  | 93                 | 328                | 245.6                    | 
| Totals         | 24                  | 9                  | 241                | 935.6              | 351.2                    |



<!-- Web Links -->
[NodeJS]: https://nodejs.org/en/
[npm]: https://www.npmjs.com/
[great blog post from Alexander Kasiuk]: https://www.future-processing.pl/blog/on-problems-with-threads-in-node-js/
[Amazon RDS]: https://aws.amazon.com/rds
[NodeJS version]: https://github.com/irishshagua/java-nodejs-io-comparison/tree/master/nodeJS
[Java version]: https://github.com/irishshagua/java-nodejs-io-comparison/tree/master/java
[which is available on github]: https://github.com/irishshagua/java-nodejs-io-comparison/tree/master/java
[Undertow]: http://undertow.io/

<!-- Images -->
[RDS Dashboard]: https://res.cloudinary.com/irishshagua/image/upload/v1604006050/blog/JavaNodePerfComp/RDS-Dash_pvuwal.png
[NodeJS Event Loop]: https://www.future-processing.com/blog/wp-content/uploads/2015/04/threads-in-node.ja_.png