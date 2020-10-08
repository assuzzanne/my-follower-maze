const chai = require("chai");

const { deadLetterQueueInstance } = require("../singletons/deadLetterQueue");
const { processEvent } = require("../server");

describe("Server", () => {
  describe("Dead Letter Queue", () => {
    it("should not add event to dead letter queue if it is well formated", () => {
      const event = [99797, "S", 14];
      processEvent(event);

      chai.expect(deadLetterQueueInstance.count()).to.equal(0);
    });

    it("should add event to dead letter queue if eventType is not in the right format", () => {
      const event = [99797, "s", 14];
      processEvent(event);

      chai.expect(deadLetterQueueInstance.count()).to.equal(1);
    });

    it("should add event to dead letter queue if eventType is an empty string", () => {
      const event = [39613, "", 11];
      processEvent(event);

      chai.expect(deadLetterQueueInstance.count()).to.equal(2);
    });

    it("should add event to dead letter queue if eventType is missing", () => {
      const event = [39613, 11];
      processEvent(event);

      chai.expect(deadLetterQueueInstance.count()).to.equal(3);
    });
  });
});
