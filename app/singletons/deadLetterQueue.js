const deadLetterQueue = [];
const deadLetterQueueInstance = {
  enqueue: (event) => deadLetterQueue.push(event),
  dequeue: (event) => deadLetterQueue.shift(event),
  peek: (event) =>
    !deadLetterQueue.isEmpty() ? deadLetterQueue[0] : undefined,
  isEmpty: () => deadLetterQueue.length == 0,
  size: () => deadLetterQueue.length,
};
Object.freeze(deadLetterQueueInstance);

exports.deadLetterQueueInstance = deadLetterQueueInstance;
