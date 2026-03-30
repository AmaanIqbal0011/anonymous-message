'use client'

import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2, Clock } from 'lucide-react'
import { Message } from '@/model/User'
import axios from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { toast } from 'sonner'
import { Types } from 'mongoose'

type MessageCardProps = {
  message: Message
  onMessageDelete: (messageId: Types.ObjectId) => void
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: days > 365 ? "numeric" : undefined,
  })
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
      toast.success(response.data.message || "Message deleted")
      onMessageDelete(message._id)
    } catch {
      toast.error("Failed to delete message")
    }
  }

  return (
    <div className="group rounded-2xl bg-white border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200">

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Clock className="h-3.5 w-3.5" />
          <span>{formatTimeAgo(message.createdAt)}</span>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="flex items-center justify-center h-8 w-8 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200">
              <Trash2 className="h-4 w-4" />
            </button>
          </AlertDialogTrigger>

          <AlertDialogContent className="rounded-2xl border-0 bg-white p-0 shadow-2xl sm:max-w-md overflow-hidden">
            <div className="flex flex-col items-center text-center p-6 pb-0">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 mb-4">
                <Trash2 className="h-7 w-7 text-red-600" />
              </div>
              <AlertDialogTitle className="text-lg font-semibold text-gray-900">
                Delete this message?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-gray-500 mt-2">
                This action cannot be undone. The message will be permanently removed from your inbox.
              </AlertDialogDescription>
            </div>
            <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 p-6 pt-4 bg-gray-50">
              <AlertDialogCancel className="rounded-xl border-gray-200 bg-white text-gray-700 hover:bg-gray-100 h-11 px-4">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="rounded-xl bg-red-600 hover:bg-red-700 text-white h-11 px-6 shadow-lg shadow-red-200"
              >
                Delete Message
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Content */}
      <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
        {message.content}
      </p>

      {/* Footer tag */}
      <div className="mt-4 pt-3 border-t border-gray-50">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-400">
          <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
          Anonymous
        </span>
      </div>
    </div>
  )
}

export default MessageCard
