'use client'

import { useState } from "react"
import axios, { AxiosError } from "axios"
import { toast } from "sonner"
import { ApiResponse } from "@/types/ApiResponse"
import { useRouter, } from "next/navigation"
import { useSearchParams } from "next/navigation"
import AuthProvider from "@/context/AuthProvider"

const HomePage =  () => {
  const router = useRouter()
  const searchParams =  useSearchParams()
  const usernameFromUrl = searchParams.get("username") || ""

  const [formData, setFormData] = useState({
    username: usernameFromUrl,
    content: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.username.trim()) {
      toast.error("Please enter a username")
      return
    }
    if (formData.content.trim().length < 10) {
      toast.error("Message must be at least 10 characters")
      return
    }

    setIsLoading(true)

    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username: formData.username.trim(),
        content: formData.content.trim(),
      })

      toast.success(response.data.message || "Message sent")
      setFormData((prev) => ({ ...prev, content: "" }))
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(
        axiosError.response?.data.message || "Failed to send message"
      )
    } finally {
      setIsLoading(false)
    }
  }

  const suggestedMessages = [
    "What’s something you’ve never told anyone?",
    "What motivates you when life gets hard?",
    "What’s one thing you admire about yourself?",
    "What advice would you give your future self?",
    "What makes you genuinely happy?",
  ]

  return (
    <AuthProvider>
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-4 py-16">
      <div className="mx-auto max-w-4xl space-y-16">

        {/* Hero */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-gray-900">
            Send anonymous messages
          </h1>
          <p className="max-w-2xl mx-auto text-gray-500 text-lg">
            Say what you feel — honestly, safely, and anonymously.
          </p>
        </div>

        {/* Message Card */}
        <div className="rounded-3xl bg-white/70 backdrop-blur p-6 md:p-8 shadow-xl space-y-6">

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Username */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Send to
              </label>
              <input
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="username"
                disabled={isLoading}
                className="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Message */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Your message
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={6}
                placeholder="Write something honest…"
                disabled={isLoading}
                className="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Minimum 10 characters</span>
                <span>{formData.content.length}/500</span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-medium text-white hover:bg-indigo-500 transition disabled:opacity-50"
            >
              {isLoading ? "Sending…" : "Send message"}
            </button>
          </form>

          {/* Suggestions */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">
              Need inspiration?
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedMessages.map((msg, i) => (
                <button
                  key={i}
                  type="button"
                  disabled={isLoading}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, content: msg }))
                  }
                  className="rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-200 transition"
                >
                  {msg}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            ["100% Anonymous", "Your identity is never revealed"],
            ["Instant Delivery", "Messages arrive immediately"],
            ["No Account Needed", "Send without signing up"],
          ].map(([title, desc]) => (
            <div key={title} className="space-y-2">
              <h3 className="font-medium text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center space-y-4">
          <p className="text-gray-500">
            Want to receive anonymous messages too?
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-xl border border-indigo-600 px-6 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition"
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
    </AuthProvider>
  )
}

export default HomePage
