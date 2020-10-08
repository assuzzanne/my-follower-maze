const chai = require("chai");

const {
  addToDeadLetterQueue,
  deadLetterQueueInstance,
} = require("../../singletons/deadLetterQueue");

describe("Dead Letter Queue", () => {
  beforeEach(() => {
    deadLetterQueueInstance.clearOut();
  });
  describe("addToDeadLetterQueue", () => {
    it("should add event to dead letter queue", () => {
      const event = [99797, "MALFORMED", 14];
      addToDeadLetterQueue(event);

      chai.expect(deadLetterQueueInstance.count()).to.equal(1);
      chai.expect(deadLetterQueueInstance.get()).to.include(event);
    });
  });
});
