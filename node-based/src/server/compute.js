exports.getSpeed = (previous, delta, lastChange) => {
  //TODO: create a logic which works based on delta and return either HIGH/MEDIUM/LOW/OFF
  let change = parseInt(lastChange);
  let state = "OFF";
  switch (change) {
    case 0:
      state = "OFF";
      break;
    case change > 4:
      state = "HIGH";
      break;
    case change === 4 || change === 3:
      state = "MEDIUM";
      break;
    case change === 2 || change === 1:
      state = "LOW";
      break;
    default:
      state = "OFF";
  }
  return state;
};