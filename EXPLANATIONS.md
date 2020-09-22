## Deliverables For Part 1

To run the server: `npm start`

As the coding challenge is about processing events, I decided early on to go for a customed event-driven architecture. The way I have structured my app is reflecting the event flow. The event comes in from the Event Source and is received by the server which directs it to the Event Dispatcher which would have turned into a proper bus (Event Bus) if I have had more time to implement the dead letter queue. The Event Dispatcher consumes and sends the event towards the right (event) handler which contains the business rules.

To make the solution production-ready, I would have set up a proper Event Bus using RabbitMQ. The routing as well as the consumption of the events in the right order would have been handled by the Bus. I would have set up a queue per event handler. I would have also set up a retry queue for all the events/messages that could not be ack during the first run to try to consume them again before ending up in the dead letter queue. In order to consume the events in the wanted order, I would have create an event versioning system which would have meant modifiying the structure of the events, which I was not able to do in this context.

Additionally, I would have set up a database used as an Event Store for storing the events and potentially create data projections from aggregation of events. Event Sourcing is often used paired up with CQRS so if the rest of the codebase would had being suitable, I might would have considered implementing it.