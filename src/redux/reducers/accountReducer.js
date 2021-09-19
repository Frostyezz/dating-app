import { SAVE_USER } from "../actions/types";

const initialState = {
  account: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SAVE_USER:
      return action.payload;
    default:
      return state;
  }
}
