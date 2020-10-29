---
title: "Dealing with PubSub in Akka"
date: 2016-11-28

tags:
- work
- scala
- akka

thumbnailImagePosition: left
autoThumbnailImage: yes
metaAlignment: center
coverImage: https://res.cloudinary.com/irishshagua/image/upload/v1604006341/blog/AkkaPubSub/AkkaDistributedPubSub_lndom2.png
coverCaption: "Akka PubSub"
comments: false
showTags: true
showPagination: true
showSocial: true
showDate: true
summary: "An issue with distributed PubSub in Akka"

---

One of the projects that I was working on recently required a solution which fell very nicely into a publish subscribe type solution. I was using Akka, and needed many actors of one type to listen to a change in an actor of another type. A quick google showed that Akka offered a [Distributed PubSub] actor out of the box. I wanted to do a quick prototype to see if it would fit the problem that I was trying to use it for.

## Requirements
Using Akka Sharding, multiple actors who would need to listen for the changes (the subscribers) and would be distributed across many nodes in a cluster. The DistributedPubSub mediator extension creates a single actor in each node which act as a relay for all published messages. A publisher will send a message to the mediator which will then forward the message to all subscribed actors within the node and to the mediators in each of the other nodes for distribution to the remote actors. As there was a large number of subscribers, and there would possibly be large periods of quiet time (i.e. no messages of interest being published), the subscribing actors would be passivated. What needed to be established was whether or not the mediator would act the same with passivated actors.

## Setup
To model the problem we need a publisher which would be responsible for broadcasting the message:

```scala
    class PublisherActor extends Actor with ActorLogging {
      log.info(s"Publisher ${self.path.name} actor instance created")

      val mediator = DistributedPubSub(context.system).mediator

      override def receive: Receive = {
        case event: UpdateableEvent => {
          log.info(s"$event to be routed to all listeners")
          mediator ! Publish(s"Publisher-${self.path.name}", event)
        }
      }
    }
```

And a subscriber. The subscriber extends PersistentActor to enable passivation during quiet periods. In this instance the actor will go to sleep after 20 seconds of inactivity:

```scala
    class SubscribingActor extends PersistentActor with ActorLogging {

      var state: SubscriberState = SubscriberState(subscribedPublisher = None)
      val mediator = DistributedPubSub(context.system).mediator

      context.setReceiveTimeout(20 seconds)

      def updateSubscriberState(publisher: UpdateableEvent): SubscriberState =
        state.copy(subscribedPublisher = Some(publisher.id))

      override def receiveCommand: Receive = {
        case event: UpdateableEvent => persist(event) state = 
          updateSubscriberState(event)
        case subscription: Subscription => 
          mediator ! Subscribe(s"Publisher-${subscription.publisherId}", self)
        case SubscribeAck(Subscribe(subscribedTopic, group, subscribee)) ⇒ noop
        case ReceiveTimeout => context.stop(self)
      }
    }
```

To control the test, a simple REST interface was placed in front of these actors. This would enable control around when messages were published. The full code for this can be found on [github].


## Execution
Testing was quite simple. Using a curl request, create a Subscriber.


```bash
    curl -X POST -H "Content-Type: application/json" -d @subscription.json 127.0.0.1:8080/subscriber
```

Before the subscriber is passivated, publish an event and make sure that the subscriber received the event.

```bash
    curl -X POST -H "Content-Type: application/json" -d @updateableEvent.json 127.0.0.1:8080/publisher
```

And then after the subscriber was passivated, resubmit the event and see if the subscriber was awoken to process the
event.


## Results
Unfortunately as can be seen from the logs below, the mediator seems to only hold a reference to the current actor path
and therefore, the event which is published after the actor is passivated does not wake the sleeping subscriber from its
slumber... :disappointed:

      15:06:23.259 c.m.a.SubscribingActor - Subscriber-1234567 actor instance created
      15:06:23.262 c.m.a.SubscribingActor - Subscriber-1234567 is subscribing to 7654321
      15:06:23.268 c.m.a.SubscribingActor - Actor[akka://PubSubTestSystem/system/sharding/SubscriberShard/21/1234567#1516056761] is subscribed to Publisher-7654321
      15:06:31.085 c.m.a.PublisherActor - Publisher 7654321 actor instance created
      15:06:31.086 c.m.a.PublisherActor - UpdateableEvent(7654321,40.5) to be routed to all listeners
      15:06:31.090 c.m.a.SubscribingActor - Applying UpdateableEvent(7654321,40.5) to Subscriber-1234567
      15:06:51.107 c.m.a.SubscribingActor - Subscriber-1234567 is going to sleep now
      15:07:01.704 c.m.a.PublisherActor - UpdateableEvent(7654321,40.5) to be routed to all listeners
      15:07:01.704 a.a.LocalActorRef - Message [com.mooneyserver.akkapubsub.UpdateableEvent] from Actor[akka://PubSubTestSystem/system/sharding/PublisherShard/21/7654321#65243080] to Actor[akka://PubSubTestSystem/system/sharding/SubscriberShard/21/1234567#1516056761] was not delivered. [3] dead letters encountered. This logging can be turned off or adjusted with configuration settings 'akka.log-dead-letters' and 'akka.log-dead-letters-during-shutdown'

<!-- Weblinks -->
[Distributed PubSub]: http://doc.akka.io/docs/akka/current/scala/distributed-pub-sub.html
[github]: https://github.com/irishshagua/akka-distributed-pub-sub-testing