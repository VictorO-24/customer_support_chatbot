"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Agent from "@/components/Agent"
import User from "@/components/User"
import { useState, useRef, useEffect } from "react"
import { ModeToggle } from "./ModeToggle"
import { UserContext } from "@/context/AuthContext"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
export function CustomerChatUI() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Living Well Hospital support assistant. How can I help you today?",
    },
  ])
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();
  const {user, logOut} = UserContext();
  useEffect(()=>{
    if(!user){
      router.push("/login")
    }
  })
  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true)  // Don't send empty messages

    setMessage('')
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ])
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      })
  
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
  
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
  
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value, { stream: true })
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ]
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ])
    }

    setIsLoading(false)
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div
      className="flex flex-col h-screen w-full max-w-4xl mx-auto bg-background rounded-lg shadow-lg">
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-4">
          <div
            className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center">
            <MessageCircleIcon className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-medium">Customer Support</h2>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <SearchIcon className="w-5 h-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon">
            <SettingsIcon className="w-5 h-5 text-muted-foreground" />
          </Button>
          <ModeToggle/>
          <Button onClick={logOut}>
            <LogOut/>
          </Button>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Add Agent or User */}
        {messages.map((message, index)=>(
          message.role === 'assistant' ? <Agent key={index} message={message.content} /> : <User key={index} message={message.content} name={user? user.displayName : "you"} image={user? user.photoURL : ""} />
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="border-t px-6 py-4 flex items-center gap-4">
        <Input onKeyPress={handleKeyPress} disabled={isLoading} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message..." className="flex-1" />
        <Button onClick={sendMessage} disabled={isLoading} >
          <SendIcon className="w-5 h-5" />
            <span className="sr-only">Send</span>
        </Button>
      </div>
    </div>
  );
}

function MessageCircleIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>)
  );
}


function SearchIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>)
  );
}


function SendIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>)
  );
}


function SettingsIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path
        d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>)
  );
}
