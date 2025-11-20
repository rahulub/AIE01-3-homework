"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, Sparkles, Coffee, Zap, Heart } from "lucide-react"

type Message = {
  role: "user" | "assistant"
  content: string
}

export default function HotMessCoachUI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hey there! I'm your Hot Mess Coach! Ready to turn your chaos into... slightly organized chaos? Let's chat!",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Playful floating icons animation data
  const floatingIcons = [
    { Icon: Sparkles, delay: 0, duration: 4, left: 20, top: 10 },
    { Icon: Coffee, delay: 1, duration: 5, left: 50, top: 35 },
    { Icon: Zap, delay: 2, duration: 4.5, left: 80, top: 60 },
    { Icon: Heart, delay: 1.5, duration: 5.5, left: 15, top: 70 },
  ]

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  async function sendMessage() {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = inputMessage.trim()
    setInputMessage("")

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])

    setIsLoading(true)

    try {
      // Use environment variable for backend URL, fallback to localhost for development
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      const apiEndpoint = `${backendUrl}/chat`

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Add assistant message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || data.response || data.message || "Sorry, I got a bit confused there!",
        },
      ])
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Oops! Looks like I'm having trouble connecting. Let me try again in a moment!",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingIcons.map(({ Icon, delay, duration, left, top }, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-20"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          >
            <Icon className="w-16 h-16 text-purple-400" />
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 border-b-4 border-purple-300 bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-md opacity-60"></div>
                <Sparkles className="relative w-10 h-10 text-yellow-600" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-purple-900 tracking-tight transform -rotate-1">
                  Hot Mess Coach
                </h1>
                <p className="text-sm text-purple-700 font-semibold italic">Your chaos, simplified!</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-purple-800">
              <Coffee className="w-5 h-5" />
              <span className="font-semibold text-sm">Powered by AI</span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="relative z-10 container mx-auto px-4 py-6 h-[calc(100vh-180px)] flex flex-col">
        {/* Messages */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4 mb-4 scroll-smooth">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-slide-in`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {message.role === "assistant" ? (
                <Card className="max-w-[80%] p-4 bg-white border-3 border-purple-300 shadow-lg transform hover:rotate-1 transition-transform">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-md">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-purple-600 mb-1">Hot Mess Coach</p>
                      <p className="text-foreground leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="max-w-[80%] p-4 bg-gradient-to-br from-blue-500 to-purple-600 text-white border-3 border-blue-400 shadow-lg transform hover:-rotate-1 transition-transform">
                  <div className="flex items-start gap-3 justify-end">
                    <div className="flex-1 text-right">
                      <p className="text-sm font-bold text-blue-100 mb-1">You</p>
                      <p className="leading-relaxed">{message.content}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-md">
                      <Coffee className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </Card>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start animate-slide-in">
              <Card className="max-w-[80%] p-4 bg-white border-3 border-purple-300 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center animate-pulse">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Input Area */}
        <Card className="p-4 bg-white border-4 border-purple-400 shadow-2xl transform hover:scale-[1.01] transition-transform">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              sendMessage()
            }}
            className="flex gap-3"
          >
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Tell me about your chaos..."
              className="flex-1 text-base border-2 border-purple-300 focus:border-purple-500 focus:ring-purple-400"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send className="w-5 h-5" />
              )}
              <span className="ml-2 hidden sm:inline">Send</span>
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2 text-center italic">
            Press Enter to send • Your hot mess is safe with me!
          </p>
        </Card>
      </div>
    </main>
  )
}
