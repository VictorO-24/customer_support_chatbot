'use client'
import { CustomerChatUI } from "@/components/customer-chat-ui";
import { UserContext } from "@/context/AuthContext";
import {useState, useEffect} from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const {user,} = UserContext()
  const [loading, setLoading] = useState(true)
  const router = useRouter();

  useEffect(()=>{
    const checkAuthentication = async()=>{
        await new Promise((resolve)=> setTimeout(resolve, 50));
        setLoading(false)
    }
    checkAuthentication()
  }, [user])

  return (
    <main>
      {loading ? ("Loading") : user ? <CustomerChatUI/> : router.push("/login")}
      
    </main>
  );
}
