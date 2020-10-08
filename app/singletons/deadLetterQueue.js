const deadLetterQueue = [];
const deadLetterQueueInstance = {
  enqueue: (event) => deadLetterQueue.push(event),
  dequeue: (event) => deadLetterQueue.shift(event),
  peek: () => (!deadLetterQueue.isEmpty() ? deadLetterQueue[0] : undefined),
  isEmpty: () => deadLetterQueue.length == 0,
  count: () => deadLetterQueue.length,
  get: () => console.log(deadLetterQueue),
};
Object.freeze(deadLetterQueueInstance);

exports.deadLetterQueueInstance = deadLetterQueueInstance;
