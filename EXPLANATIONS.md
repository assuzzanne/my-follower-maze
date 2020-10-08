## Part 1: Follower Maze - Refactor && Part 2: Follower Maze - Extension

**UPDATED**

To run the server: `npm start`

As the coding challenge is about processing events, I decided early on to go for a customed event-driven architecture. The way I have structured my app is reflecting the event flow. The event comes in from the Event Source and is received by the server which processes it using the Event Bus. Subscriptions are created - the event handlers subscribe to events. When the event of interest is published in the Event Bus, the publish function looks for the right subscription in the eventBusSubscriptions object and calls the event handler with the provided args.

To make the solution production-ready, I would have set up a Event Bus using a proper message broker, RabbitMQ. Accepting messages from publishers, routing them to the queues as well as storing them for consumption or immediately delivering to consumers in the right order would have been handled by the message broker. As it supports multiple messaging protocols, it would offer me to choice the most adapted for the solution. I would have set up a queue per event handler. I would have also set up a system of retry queues for all the events/messages that could not be ack during the first run to try to consume them again before ending up in the dead letter queue. In order to consume the events in the wanted order, I would have create an event versioning system which would have meant modifiying the structure of the events, which I was not able to do in this context. But this is quite complex. In my former workplace, we were struggling with this big issue.

Additionally, I would have set up a database used as an Event Store for storing the events and potentially create data projections (for users for example) from aggregation of events. Event Sourcing is often used paired up with CQRS so if the rest of the codebase would had being suitable, I might would have considered implementing it.
