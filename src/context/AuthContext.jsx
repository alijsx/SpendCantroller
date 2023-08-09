import { onAuthStateChanged } from "firebase/auth";
import React, { useReducer, useEffect, createContext } from "react";
import { auth } from "../config/firebase";



export const AuthContext = createContext();

const initialState = { isAuthenticated: false }

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN": {
      const { user } = action.payload;
      return {
        isAuthenticated: true,
        user: user ? user : null,
      };
    }
    case "LOGOUT":
      return {
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};


export default function AuthContextProvider(props) {
  const [state, dispatch] = useReducer(reducer, { isAuthenticated: false });

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({ type: "LOGIN", payload: { user } });
      } else {
        dispatch({ type: "LOGOUT" });
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {props.children}
    </AuthContext.Provider>
  );
}
