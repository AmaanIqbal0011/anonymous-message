'use client'

import { useState, Suspense } from "react"
import axios, { AxiosError } from "axios"
import { toast } from "sonner"
import { ApiResponse } from "@/types/ApiResponse"
import { useRouter, useSearchParams } from "next/navigation"
import { Send, Shield, Zap, Eye, Sparkles, ArrowRight, MessageCircle } from "lucide-react"

// Component that uses useSearchParams - wrapped in Suspense
const HomePageContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
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
    "What's something you've never told anyone?",
    "What motivates you when life gets hard?",
    "What's one thing you admire about yourself?",
    "What advice would you give your future self?",
    "What makes you genuinely happy?",
  ]

  const features = [
    {
      icon: Shield,
      title: "100% Anonymous",
      description: "Your identity is never revealed. Send messages with complete privacy.",
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      icon: Zap,
      title: "Instant Delivery",
      description: "Messages arrive immediately. No delays, no waiting.",
      color: "bg-amber-50 text-amber-600",
    },
    {
      icon: Eye,
      title: "No Account Needed",
      description: "Send messages without signing up. Just type and send.",
      color: "bg-emerald-50 text-emerald-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">

      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-indigo-100 opacity-40 blur-3xl animate-pulse-soft" />
        <div className="absolute top-1/3 -left-40 h-96 w-96 rounded-full bg-sky-100 opacity-30 blur-3xl animate-pulse-soft animation-delay-200" />
        <div className="absolute bottom-20 right-1/4 h-64 w-64 rounded-full bg-violet-100 opacity-30 blur-3xl animate-pulse-soft animation-delay-400" />
      </div>

      <div className="relative">

        {/* Hero Section */}
        <section className="px-4 pt-16 pb-12 sm:pt-24 sm:pb-16">
          <div className="mx-auto max-w-4xl text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700 mb-6">
              <Sparkles className="h-4 w-4" />
              Trusted by thousands of users
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              Send anonymous
              <span className="block bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                messages
              </span>
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-lg sm:text-xl text-gray-500 leading-relaxed">
              Say what you feel — honestly, safely, and anonymously.
              No sign-up required to send.
            </p>
          </div>
        </section>

        {/* Send Message Card */}
        <section className="px-4 pb-16 sm:pb-24">
          <div className="mx-auto max-w-2xl animate-slide-up animation-delay-200">
            <div className="rounded-2xl bg-white border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">

              {/* Card Header */}
              <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                    <Send className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Send a Message</h2>
                    <p className="text-sm text-gray-500">Your identity stays hidden</p>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="px-6 sm:px-8 py-6 sm:py-8 space-y-5">
                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Username */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Recipient
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                      <input
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="username"
                        disabled={isLoading}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-9 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Your message
                    </label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      rows={5}
                      placeholder="Write something honest…"
                      disabled={isLoading}
                      maxLength={500}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all disabled:opacity-50"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Minimum 10 characters</span>
                      <span className={formData.content.length >= 450 ? "text-amber-500 font-medium" : ""}>
                        {formData.content.length}/500
                      </span>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all duration-200 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send message
                      </>
                    )}
                  </button>
                </form>

                {/* Suggestions */}
                <div className="space-y-3 pt-2">
                  <p className="text-sm font-medium text-gray-500">
                    💡 Need inspiration?
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
                        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 disabled:opacity-50"
                      >
                        {msg}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-4 pb-16 sm:pb-24">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-12 animate-slide-up animation-delay-400">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Why people love Whisper</h2>
              <p className="mt-3 text-gray-500">Simple, secure, and always anonymous</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <div
                  key={feature.title}
                  className="group rounded-2xl bg-white border border-gray-100 p-6 sm:p-8 hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-200 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${400 + i * 150}ms` }}
                >
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 pb-20 sm:pb-28">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-8 sm:p-12 text-center text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50" />
              <div className="relative">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-white/10 backdrop-blur mb-6">
                  <MessageCircle className="h-7 w-7" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                  Want to receive anonymous messages?
                </h2>
                <p className="text-white/70 mb-8 max-w-lg mx-auto">
                  Create your free account and share your unique link with friends to start receiving honest, anonymous messages.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => router.push("/sign-up")}
                    className="w-full sm:w-auto rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-indigo-700 hover:bg-gray-100 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="w-full sm:w-auto rounded-xl border border-white/30 bg-white/10 backdrop-blur px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-100 px-4 py-8">
          <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-indigo-600 flex items-center justify-center">
                <MessageCircle className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-medium text-gray-500">Whisper</span>
            </div>
            <p>© {new Date().getFullYear()} Whisper. Built with ❤️ for honest conversations.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

// Main page component wrapped with Suspense for useSearchParams
const HomePage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  )
}

export default HomePage
