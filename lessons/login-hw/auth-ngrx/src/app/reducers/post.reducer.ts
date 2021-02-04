import * as userActions from '../actions/post.actions';
import {User} from '../models/post.model';
export type Action=userActions.All;

const initialState = new User(null, 'GUEST');

export const userReducer=(state=initialState, action: userActions.All)=> {
    switch (action.type) {
      case userActions.GET_USER: {
        return {
          ...state,
          loading:true
        };
      }
      case userActions.LOGIN_SUCCESS: {
        return {
          ...state,
          loading:false,
          ...action.payload
        };
      }
      case userActions.LOGIN_FAILURE: {
        return {
          ...state,
          ...initialState,
          loading:false,
          error: 'Incorrect email and/or password.'
        };
      }
      case userActions.GOOGLE_LOGIN:
        return { ...state, loading: true };
      case userActions.LOGOUT: {
        return {
          ...state,
          loading:true
        };
      }
      default: {
        return state;
      }
    }
  }