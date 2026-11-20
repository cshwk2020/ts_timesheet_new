// src/reducers/errorReducer.ts
import { type ErrorState, SET_ERROR, CLEAR_ERROR } from '../types';

const initialState: ErrorState = {
  message: null,
};

// 👇 Make sure the action type is explicitly 'any' or your root Action type
const errorReducer = (state: ErrorState = initialState, action: any): ErrorState => {
  switch (action.type) {
    case SET_ERROR:
        console.log("SET_ERROR :: ",  { 
        ...state, 
        message: action.payload 
      });
      return { 
        ...state, 
        message: action.payload as string 
      };
    case CLEAR_ERROR:
      return { 
        ...state, 
        message: null 
      };
    default:
      return state;
  }
};


export default errorReducer;