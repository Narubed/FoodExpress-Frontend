function reducer(state = false, action) {
  switch (action.type) {
    case 'OPEN':
      return true;
    case 'TURNOFF':
      return false;
    default:
      return state;
  }
}

export default reducer;
