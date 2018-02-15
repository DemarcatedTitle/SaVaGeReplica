export const isTyping = number => {
  return {
    type: 'FRAME_NUMBER_MODIFIED',
    number,
  };
};
export const VALUE_CHANGED = value => {
  return {
    type: 'VALUE_CHANGED',
    value,
  };
};
export const INCREMENT_FRAME_NUMBER = { type: 'INCREMENT_FRAME_NUMBER' };
export const DECREMENT_FRAME_NUMBER = { type: 'DECREMENT_FRAME_NUMBER' };
