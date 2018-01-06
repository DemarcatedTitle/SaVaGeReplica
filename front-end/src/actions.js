export const isTyping = text => {
  return {
    type: 'IS_TYPING',
    text,
  };
};

export const isLoading = loading => {
  return {
    type: 'IS_LOADING',
    loading,
  };
};
