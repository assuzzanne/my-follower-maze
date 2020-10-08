const chai = require("chai");

const { deadLetterQueueInstance } = require("../singletons/deadLetterQueue");

const { writeToClient } = require("../client");

describe("Client", () => {
    beforeEach(() => {
      deadLetterQueueInstance.clearOut();
    });
  
    describe("#writeToClient", () => {
      describe("#isEventValid", () => {
        it("should add event to dead letter queue if no client is connected", () => {
          // it works because my clientPool is empty during the execution of this test
            const event = "98238|F|19|15";
            const userId = "15";
            writeToClient(userId, event);
      
            chai.expect(deadLetterQueueInstance.count()).to.equal(1);
            chai.expect(deadLetterQueueInstance.get()).to.include(event);
        });
      });
    });
  });
  