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

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

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
    setIsLoading(true)
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages")
      setMessages(response.data.messages || [])
      if (refresh) toast.success("Messages refreshed")
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message)
    } finally {
      setIsLoading(false)
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

  if (!session?.user) return null

  const { username }  = session.user as User & { username: string }
  // const baseUrl = `${window.location.protocol}//${window.location.host}`
  // const profileUrl = `${baseUrl}/u/${username}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-4 py-12">
      <div className="mx-auto max-w-5xl space-y-10">

        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-gray-900">
            Welcome, {username}
          </h1>
          <p className="text-gray-500">
            Your anonymous message inbox
          </p>
        </div>

        {/* Profile Link */}
        <div className="rounded-2xl bg-white/70 backdrop-blur p-6 shadow-sm">
          <p className="text-sm text-gray-500 mb-2">Your public name</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={username}
              readOnly
              className="flex-1 rounded-xl bg-gray-100 px-4 py-2 text-sm text-gray-700"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(username)
                toast.success("Link copied")
              }}
              className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Accept Messages */}
        <div className="flex items-center justify-between rounded-2xl bg-white/60 backdrop-blur p-6 shadow-sm">
          <div>
            <p className="font-medium text-gray-800">Accept messages</p>
            <p className="text-sm text-gray-500">Allow people to send you messages</p>
          </div>

          <button
            onClick={handleSwitchChange}
            className={`relative h-7 w-12 rounded-full transition ${
              acceptMessages ? "bg-emerald-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white transition ${
                acceptMessages ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>

        {/* Messages */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-800">Messages</h2>
            <button
              onClick={() => fetchMessages(true)}
              className="text-sm text-indigo-600 hover:underline"
            >
              Refresh
            </button>
          </div>

          {isLoading && (
            <p className="text-sm text-gray-500">Loading messages…</p>
          )}

          {!isLoading && messages.length === 0 && (
            <p className="text-sm text-gray-500">No messages yet</p>
          )}

          <div className="grid gap-4">
            {messages.map((message) => (
              <MessageCard
                key={message._id}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
