const getNextUniqueId = getIdGenerator();

function getIdGenerator() {
  let lastId = 0;

  return function getNextUniqueId() {
    lastId += 1;
    return lastId;
  };
}

const eventBusSubscriptions = {};
const eventBus = {
  subscribe: (eventType, callback) => {
    const id = getNextUniqueId();

    if (!eventBusSubscriptions[eventType])
      eventBusSubscriptions[eventType] = {};

    eventBusSubscriptions[eventType][id] = callback;

    return {
      unsubscribe: () => {
        delete eventBusSubscriptions[eventType][id];
        if (Object.keys(eventBusSubscriptions[eventType]).length === 0) {
          delete eventBusSubscriptions[eventType];
        }
      },
    };
  },
  publish: (eventType, args) => {
    if (!eventBusSubscriptions[eventType]) return;

    console.log(eventBusSubscriptions)
    Object.keys(eventBusSubscriptions[eventType]).forEach((key) => {
      eventBusSubscriptions[eventType][key](args);
    });
  },
};
Object.freeze(eventBus);
exports.eventBus = eventBus;
