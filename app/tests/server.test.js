const chai = require("chai");

const { deadLetterQueueInstance } = require("../singletons/deadLetterQueue");
const { processEvent, isEventValid } = require("../server");

describe("Server", () => {
  beforeEach(() => {
    deadLetterQueueInstance.clearOut();
  });

  describe("Dead Letter Queue", () => {
    describe("#isEventValid", () => {
      it("should return true if event is well formated", () => {
        const event = "99797|S|14";
        const result = isEventValid(event);

        chai.expect(result).to.equal(true);
      });

      it("should return false if event is malformed", () => {
        const event = "100|";
        const result = isEventValid(event);

        chai.expect(result).to.equal(false);
      });

      it("should return false if event is not a string", () => {
        const event = 1;
        const result = isEventValid(event);

        chai.expect(result).to.equal(false);
      });
    });

    describe("#processEvent", () => {
      it("should not add event to dead letter queue if eventType is well formated", () => {
        const event = [99797, "S", 14];
        processEvent(event);

        chai.expect(deadLetterQueueInstance.count()).to.equal(0);
      });

      it("should add event to dead letter queue if eventType is malformed", () => {
        const event = [99797, "s", 14];
        processEvent(event);

        chai.expect(deadLetterQueueInstance.count()).to.equal(1);
      });

      it("should add event to dead letter queue if eventType is an empty string", () => {
        const event = [39613, "", 11];
        processEvent(event);

        chai.expect(deadLetterQueueInstance.count()).to.equal(1);
      });

      it("should add event to dead letter queue if eventType is missing", () => {
        const event = [39613, 11];
        processEvent(event);

        chai.expect(deadLetterQueueInstance.count()).to.equal(1);
      });
    });
  });
});
