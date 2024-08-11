"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/app/firebase/config";
import {signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider} from "firebase/auth"

const AuthContext = createContext();

export const AuthProvider = ({children})=>{
    const [user, setUser] = useState(null);

    const googleSignIn= ()=>{
        const provider = new GoogleAuthProvider()
        signInWithPopup(auth, provider)
    }

    const logOut = ()=>{
        signOut(auth)
    }

    useEffect(()=>{
        const unSubscribed = onAuthStateChanged(auth, (currentUser)=>{
            setUser(currentUser)
        })
        return ()=> unSubscribed();
    }, [user])

    return(
        <AuthContext.Provider value={{user, googleSignIn, logOut}}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserContext = ()=>{
    return useContext(AuthContext);
}