'use client'

import { Message } from "@/model/User"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "sonner"
import { User } from "next-auth"
import { Types } from "mongoose"
import MessageCard from "@/components/messageCard"
import { Switch } from "@/components/ui/switch"
import {
  RefreshCw,
  Copy,
  Check,
  MessageSquare,
  Inbox,
  Link2,
  Shield,
  Loader2,
} from "lucide-react"

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })

  const { watch, setValue } = form
  const acceptMessages = watch("acceptMessages")

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>("/api/accept-message")
      setValue("acceptMessages", response.data.isAcceptingMessages)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message)
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true)
    else setIsLoading(true)
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages")
      setMessages(response.data.messages || [])
      if (refresh) toast.success("Messages refreshed")
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      if (axiosError.response?.status !== 401) {
        toast.error(axiosError.response?.data.message || "Failed to load messages")
      }
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  const handleDeleteMessage = (messageId: Types.ObjectId) => {
    setMessages((prev) => prev.filter((m) => m._id !== messageId))
  }

  const handleSwitchChange = async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.post<ApiResponse>("/api/accept-message", {
        acceptMessages: !acceptMessages
      })
      setValue("acceptMessages", !acceptMessages)
      toast.success(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message)
    } finally {
      setIsSwitchLoading(false)
    }
  }

  useEffect(() => {
    if (!session?.user) return
    fetchMessages()
    fetchAcceptMessage()
  }, [session, fetchAcceptMessage, fetchMessages])

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  const { username } = session.user as User & { username: string }

  const handleCopyUsername = () => {
    navigator.clipboard.writeText(username)
    setCopied(true)
    toast.success("Username copied!")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">

      {/* Decorative bg */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 right-1/4 h-80 w-80 rounded-full bg-indigo-50 opacity-50 blur-3xl" />
      </div>

      <div className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mx-auto max-w-5xl space-y-8">

          {/* Header */}
          <div className="animate-slide-up">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Welcome back, {username} 👋
                </h1>
                <p className="text-gray-500 mt-1">
                  Manage your anonymous message inbox
                </p>
              </div>
              <button
                onClick={() => fetchMessages(true)}
                disabled={isRefreshing}
                className="inline-flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm disabled:opacity-50 self-start"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-up animation-delay-200">
            <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                  <MessageSquare className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
                  <p className="text-xs text-gray-500">Total Messages</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${acceptMessages ? "bg-emerald-50" : "bg-gray-100"}`}>
                  <Shield className={`h-5 w-5 ${acceptMessages ? "text-emerald-600" : "text-gray-400"}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{acceptMessages ? "Open" : "Closed"}</p>
                  <p className="text-xs text-gray-500">Inbox Status</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
                  <Inbox className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {messages.length > 0
                      ? new Date(messages[0].createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      : "—"
                    }
                  </p>
                  <p className="text-xs text-gray-500">Latest Message</p>
                </div>
              </div>
            </div>
          </div>

          {/* Share Link & Accept Toggle */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-slide-up animation-delay-400">

            {/* Share Link */}
            <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Link2 className="h-5 w-5 text-gray-400" />
                <h3 className="font-semibold text-gray-900">Your Public Username</h3>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                Share your username so people can send you anonymous messages
              </p>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center rounded-xl bg-gray-50 border border-gray-200 px-4 py-2.5">
                  <span className="text-sm text-gray-400 mr-1">@</span>
                  <span className="text-sm font-medium text-gray-700 truncate">{username}</span>
                </div>
                <button
                  onClick={handleCopyUsername}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all shadow-sm ${
                    copied
                      ? "bg-emerald-600 text-white shadow-emerald-200"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 hover:shadow-md"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span className="hidden sm:inline">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span className="hidden sm:inline">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Accept Toggle */}
            <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-gray-400" />
                <h3 className="font-semibold text-gray-900">Message Settings</h3>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 p-4">
                <div>
                  <p className="font-medium text-gray-800 text-sm">Accept Messages</p>
                  <p className="text-xs text-gray-500 mt-0.5">Allow people to send you anonymous messages</p>
                </div>
                <Switch
                  checked={acceptMessages}
                  onCheckedChange={handleSwitchChange}
                  disabled={isSwitchLoading}
                  className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-gray-300"
                />
              </div>
              <p className="text-xs text-gray-400 mt-3">
                {acceptMessages
                  ? "✅ Your inbox is open. Anyone can send you messages."
                  : "🔒 Your inbox is closed. No one can send you messages."
                }
              </p>
            </div>
          </div>

          {/* Messages Section */}
          <div className="animate-slide-up animation-delay-600">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-gray-400" />
                Messages
                {messages.length > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center h-6 min-w-6 rounded-full bg-indigo-100 px-2 text-xs font-semibold text-indigo-700">
                    {messages.length}
                  </span>
                )}
              </h2>
            </div>

            {isLoading && !isRefreshing && (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                  <p className="text-sm text-gray-500">Loading messages…</p>
                </div>
              </div>
            )}

            {!isLoading && messages.length === 0 && (
              <div className="rounded-2xl bg-white border border-dashed border-gray-200 py-16 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gray-50 mb-4">
                  <Inbox className="h-8 w-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No messages yet</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                  Share your username with friends and start receiving anonymous messages.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {messages.map((message) => (
                <MessageCard
                  key={message._id.toString()}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
