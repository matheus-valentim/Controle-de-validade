"use client";
import { createContext, useContext, useEffect, useState } from "react";
export const authContext = createContext();
export function AuthProvider({ children }) {
	const [auth, setAuth] = useState("");

	return (
		<authContext.Provider value={{ auth, setAuth }}>
			{children}
		</authContext.Provider>
	);
}
export const useAuthContext = () => useContext(context);
