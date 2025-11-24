"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { SendHorizontal, Sparkles, Heart, Brain } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function HotMessCoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hey there! 👋 I'm your Hot Mess Coach. Life feeling a bit chaotic? That's totally okay! Let's chat about what's on your mind.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Use environment variable or fallback to localhost for development
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      const apiUrl = `${backendUrl}/chat`
      
      console.log("[HotMessCoach] Calling API:", apiUrl)
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[HotMessCoach] API Error:", response.status, errorText)
        throw new Error(`API returned ${response.status}: ${errorText || "Unknown error"}`)
      }

      const data = await response.json()
      
      if (!data.reply) {
        throw new Error("Invalid response format: missing 'reply' field")
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("[HotMessCoach] Error calling API:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: error instanceof Error 
          ? `Oops! Something went wrong: ${error.message}. Can you try again? 💫`
          : "Oops! Something went a bit sideways there. Can you try again? 💫",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Playful background decorations */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float" />
      <div
        className="absolute top-40 right-20 w-32 h-32 bg-secondary/20 rounded-full blur-2xl animate-float"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-20 left-1/4 w-24 h-24 bg-accent/20 rounded-full blur-xl animate-float"
        style={{ animationDelay: "2s" }}
      />

      <div className="relative z-10 container max-w-4xl mx-auto p-4 md:p-8 min-h-screen flex flex-col">
        {/* Header */}
        <header className="text-center py-6 mb-6">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-2" style={{ fontFamily: "var(--font-comic)" }}>
            <span className="inline-block animate-wiggle">🎭</span> Hot Mess Coach{" "}
            <span className="inline-block animate-wiggle" style={{ animationDelay: "0.5s" }}>
              ✨
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">{"Your friendly chaos-to-calm companion"}</p>
          <div className="flex justify-center gap-3 mt-4">
            <div className="flex items-center gap-1 text-sm text-primary">
              <Heart className="w-4 h-4 fill-current animate-pulse" />
              <span>Supportive</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-secondary">
              <Brain className="w-4 h-4 animate-pulse-color" />
              <span>Understanding</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-accent">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Empowering</span>
            </div>
          </div>
        </header>

        {/* Chat Container */}
        <Card className="flex-1 flex flex-col shadow-2xl border-4 border-primary/30 overflow-hidden bg-card/95 backdrop-blur">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl p-4 shadow-lg ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground ml-4 rounded-tr-sm"
                      : "bg-secondary text-secondary-foreground mr-4 rounded-tl-sm"
                  }`}
                  style={{
                    transform: message.role === "assistant" ? "rotate(-0.5deg)" : "rotate(0.5deg)",
                  }}
                >
                  <p className="text-base md:text-lg leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs mt-2 opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl p-4 shadow-lg mr-4 rounded-tl-sm">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full animate-bounce" />
                    <div
                      className="w-3 h-3 bg-secondary rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t-4 border-primary/20 bg-muted/50 p-4 md:p-6">
            <div className="flex gap-2 md:gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tell me what's on your mind..."
                className="flex-1 text-base md:text-lg py-6 px-4 rounded-xl border-2 border-border focus:border-primary transition-colors bg-background"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                size="lg"
                className="rounded-xl px-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <SendHorizontal className="w-5 h-5 md:w-6 md:h-6" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
              {"Press Enter to send • Your mental wellness matters 💜"}
            </p>
          </div>
        </Card>

        {/* Footer */}
        <footer className="text-center py-6 text-sm text-muted-foreground">
          <p>{"Remember: It's okay to be a hot mess sometimes. You're doing great! 🌟"}</p>
        </footer>
      </div>
    </div>
  )
}
