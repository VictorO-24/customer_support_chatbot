'use client'

const { Card, CardTitle, CardContent, CardHeader } = require("@/components/ui/card")
import { Button } from "@/components/ui/button"
import {useState, useEffect} from "react"
import { UserContext } from "@/context/AuthContext"
import { ModeToggle } from "@/components/ModeToggle"
import { useRouter } from "next/navigation"

const Login = ()=>{
    const {user, googleSignIn, logOut} = UserContext()
    const [loading, setLoading] = useState(false)
    const route = useRouter()
    
    if(user){
        route.push("/")
    }
    console.log(user)
    const handleGoogleSignIn = async ()=>{
        try{
            await googleSignIn();
            // route.push("/")

        }
        catch(error){
            console.log(error)
        }
        finally{
            setLoading(false)
        }
    }
    
    return(
        <div className="h-screen flex justify-center items-center">
            <ModeToggle/>
            <Card >
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    
                </CardHeader>
                <CardContent>
                    <Button disabled={loading} onClick={handleGoogleSignIn} variant="outline" className="w-full mt-4">
                        Login with Google
                    </Button>
                </CardContent>
                
            </Card>
        </div>
    )
}

export default Login;