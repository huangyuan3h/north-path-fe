import { PostFormType } from '../../types';
import { Action, ActionType } from './action';

export const reducer = (
  state: PostFormType,
  action: ActionType
): PostFormType => {
  switch (action.type) {
    case Action.SET_SUBJECT:
      return {
        ...state,
        subject: action.subject,
      };
    case Action.SET_CONTENT:
      return {
        ...state,
        content: action.content,
      };
    case Action.SET_CATEGORIES:
      return {
        ...state,
        categories: action.categories,
      };
    case Action.SET_IMAGES:
      return {
        ...state,
        images: [...action.images],
      };
    default:
      return state;
  }
};
