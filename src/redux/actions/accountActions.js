import { SAVE_USER } from "./types";

export const saveUser = (account) => async (dispatch) => {
  try {
    dispatch({
      type: SAVE_USER,
      payload: { account },
    });
  } catch (error) {
    console.log(error);
  }
};
