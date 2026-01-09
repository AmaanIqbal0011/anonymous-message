
'use client'

import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { Message } from '@/model/User'
import axios from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { toast } from 'sonner'
import { Types } from 'mongoose'

type MessageCardProps = {
  message: Message
  onMessageDelete: (messageId: Types.ObjectId) => void
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
      toast.success(response.data.message || "Message deleted")
      onMessageDelete(message._id)
    } catch (error) {
      toast.error("Failed to delete message")
    }
  }

  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-lg transition rounded-xl">
      
      <CardHeader className="flex justify-between items-start">
        <div className="space-y-1">
          <CardTitle className="text-sm md:text-base font-semibold text-gray-900">
            Anonymous Message
          </CardTitle>
          <CardDescription className="text-xs text-gray-500">
            {new Date(message.createdAt).toLocaleString()}
          </CardDescription>
        </div>

        {/* Delete Button with Confirmation */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon" className="p-2 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Message?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The message will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>

      <CardContent>
        <p className="text-sm md:text-base text-gray-800">{message.content}</p>
      </CardContent>
      
    </Card>
  )
}

export default MessageCard
