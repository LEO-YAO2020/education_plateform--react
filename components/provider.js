import { createContext, useContext, useReducer } from "react";

const store = {
  total: 0,
  notification: 0,
  message: 0,
};

export const MessageContext = createContext();

export function messageReducer(state, action) {
  switch (action.type) {
    case "increment":
      return {
        ...state,
        [action.payload.type]:
          state[action.payload.type] + action.payload.count,
        total: state.total + action.payload.count,
      };
    case "decrement":
      return {
        ...state,
        [action.payload.type]:
          state[action.payload.type] - action.payload.count,
        total: state.total - action.payload.count,
      };
    case "reset":
      return { ...store };
    default:
      return { ...state };
  }
}

export const MessageProvider = (props) => {
  const [state, dispatch] = useReducer(messageReducer, store);
  return (
    <MessageContext.Provider value={{ storeState: state, dispatch }}>
      {props.children}
    </MessageContext.Provider>
  );
};

export const useMessageContext = () => {
  return useContext(MessageContext);
};
