---
title: "JVM Benchmarking"
date: 2017-02-04

tags:
- work
- java

thumbnailImagePosition: left
autoThumbnailImage: yes
metaAlignment: center
coverImage: https://res.cloudinary.com/irishshagua/image/upload/v1604007034/blog/jmh/jmh-output-cropped_mcv7nh.jpg
coverCaption: "Benchmarking"
comments: false
showTags: true
showPagination: true
showSocial: true
showDate: true
summary: "Benchmarking on the JVM"

---

I was recently looking for a way to try and integrate some performance testing into my daily development tasks. The idea being that, the current approach I had to performance testing was quite inefficient. It often involved wasted hours trying to setup test environments and executing large (and possibly expensive) load tests. And unfortunately, most of the time I'd end up running services with extra metrics enabled or with debug logging or intrusive profilers running to try and have visibility as to what was actually happening if one of the graphs said that the application was under-performing at some point. Don't get me wrong, I'm not trying to steer anyone away from doing system level load testing (as it is extremely important) but what i found was that It's difficult to get fast feedback for changes and therefore difficult to really integrate this process into the development cycle. Instead of a dev~test~perf~release cycle, you end up having multiple release candidates possibly building up before it warrants the heart ache of doing a good large scale perf test...

## [JMH]
One tool that had previously peaked my interest was the Java Microbenchmark Harness. It's available from the Open JDK project and enables you to write unit test style benchmarks of parts of your application code. The great thing about the harness is that it hides away all the Java complexities for you. For example, it handles averaging results across multiple samples of the code under test. The samples can in turn be spread across separate JVM processes to try and avoid any CPU discrepancies. The harness also manages doing a warm-up phase for each benchmark so as to eliminate any changes in performance that may occur due to [JIT optimizations]. I'm not going to try and do an introductory tutorial for JMH as there are some great ones out there already. I'd recommend taking a look at [Jenkov's tutorial] if you are interested.

## Experiment
To try and evaluate the usefulness of JMH, I set myself two problems.     

  1. Integrate a simple test benchmark into a Jenkins job. 
  2. Integrate a perf module with benchmarks into a multi module project

## Simple Benchmark
I always find it more beneficial to try and write POC code that does something useful instead of the majority of examples you find on the net which are just Hello World. In that vein, the following benchmarks try and compare the performance of the different ways in which you can iterate over a collection in Java.

You can see from the below code snippet, how the benchmarks are layed out in a JUnit annotated method style:

```java
@State(Scope.Benchmark)
@Warmup(iterations = 5, time = 500, timeUnit = TimeUnit.MILLISECONDS)
@Measurement(iterations = 10, time = 1, timeUnit = TimeUnit.SECONDS)
@Fork(2)
@Threads(4)
public class ForLoopBenchmarks {

  private List<Integer> ints;

  @Param({"100", "10000", "1000000"})
  private int size;

  @Setup
  public void createTestData() {
    ints = new ArrayList<>(size);
    IntStream.range(1, size + 1).forEach(ints::add);
  }

  @Benchmark
  public long sumWithTraditionalForLoop() {
    long sum = 0;
    for (int i = 0; i < ints.size(); i++) {
      sum += ints.get(i);
    }

    return sum;
  }
}
```

The above code snippet only shows one of the benchmarks. The [full source] for the above can be found on GitHub.    
In terms of the integration with a Jenkins job, the easiest thing to do was hook the benchmark run into the maven lifecycle. It's realtively easy to run the Benchmark suite using the mvn exec plugin. Although, I did need to use [this solution from StackOverflow] to resolve an issue with the classpath that was being used for the benchmark run. As JMH can generate a csv report (amongst other types) it would be possible to get the Jenkins job to archive the generated report as a build artifact. Below is the maven pom entry used to execute the JMH tests as part of a build. Again, the full source is available on GitHub.

```xml
<plugin>
  <groupId>org.codehaus.mojo</groupId>
  <artifactId>exec-maven-plugin</artifactId>
  <executions>
    <execution>
      <phase>verify</phase>
      <goals>
        <goal>java</goal>
      </goals>
    </execution>
  </executions>
  <configuration>
    <mainClass>com.mooneyserver.ExecuteBenchmarks</mainClass>
    <systemProperties>
      <systemProperty>
        <key>java.class.path</key>
        <value>${project.build.outputDirectory}${path.separator}${depClasspath}</value>
      </systemProperty>
    </systemProperties>
  </configuration>
</plugin>
```

## Project Integration
Having toyed around with fairly simple benhcmarks in the previous section, it was time to try and use JMH on a real world project. I'm currently working on a stream processing platform for risk analytics in the day job. The application is built using Akka with Scala. Rather surprisingly, there was absolutely no issues getting the JMH benchmark to run against scala code. The biggest issue was actually being able to access the algorithms that I wanted to test due to the fact that they were embedded inside an actor. Initially, I wasn't able to instantiate the actor. Then the algorithm that I wanted to test was too tightly bound to framework code. I eventually refactored the code to isolate the algorithm into an object def. It was actually a great way at isolating the code which would have made even unit testing it easier. If you have worked with Akka, you will be familiar with any *unit* tests (and I use that phrase with a heavy pinch of salt) that you write turning into integration tests using the Akka TestKit library (which is actually a great testing utility). Being forced to separate the actual testable logic for the Benchmarking prompted me to go an add a few extra unit tests which I had been too lazy to write initially. I can't really blame JMH for these difficulties as it was more my shitty way of writing code. But ya know, deadlines... deadlines... dealines...

I'm yet to see a real benefit with the project integration as there is not really an area of the codebase which is both algorithmicly complex and also under heavy churn. Also, to get accurate benchmark results, the build time for the project is increased by a ridiculous amount. Therefore, although it has been an interesting technical task trying to integrate benchmarking into an actual project, I'm not sure if it's something that I'll persist with for this project.

## Conclusion 
I'm only really a JMH n00b, having only scratched the surface of what it could be used for. Due to what I mentioned previously about the increased build times for a project after integrating JMH, I don't think it would be beneficial to include micro benchmarks as a first class citizen in the CI context. Unless, of course, small changes in performance are very important for your porject. I see it more as a tool for maybe prototyping with, or testing the feasability of libraries to include in a performance sensitive project. I was very impressed with the ease with which I was able to integrate benchmarks into a project. And I'm sure with more effort it would be possible to overcome some of my missgivings about using JMH in a CI context.

Overall though, I think JMH is a very good tool that I just don't have the right usecase for at the moment...


<!-- Weblinks -->
[JMH]: http://openjdk.java.net/projects/code-tools/jmh/
[JIT optimizations]: https://docs.oracle.com/cd/E13150_01/jrockit_jvm/jrockit/geninfo/diagnos/underst_jit.html
[Jenkov's tutorial]: http://tutorials.jenkov.com/java-performance/jmh.html
[full source]: https://github.com/irishshagua/java-loops-benchmark/blob/master/src/main/java/com/mooneyserver/ForLoopBenchmarks.java
[this solution from StackOverflow]: http://stackoverflow.com/questions/35574688/how-to-run-a-jmh-benchmark-in-maven-using-execjava-instead-of-execexec