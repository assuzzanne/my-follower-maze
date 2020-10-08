const deadLetterQueue = [];

function addToDeadLetterQueue(event) {
  deadLetterQueueInstance.enqueue(event);
  console.info(
    "Message added to the dead letter queue successfully!",
    event,
    deadLetterQueueInstance.count()
  );
}

const deadLetterQueueInstance = {
  enqueue: (event) => deadLetterQueue.push(event),
  dequeue: (event) => deadLetterQueue.shift(event),
  peek: () => (!deadLetterQueue.isEmpty() ? deadLetterQueue[0] : undefined),
  isEmpty: () => deadLetterQueue.length == 0,
  count: () => deadLetterQueue.length,
  get: () => deadLetterQueue,
  clearOut: () => {
    while (deadLetterQueue.length > 0) {
      deadLetterQueue.pop();
    }
  },
};
Object.freeze(deadLetterQueueInstance);

exports.deadLetterQueueInstance = deadLetterQueueInstance;
exports.addToDeadLetterQueue = addToDeadLetterQueue;
