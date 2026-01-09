'use client'

import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { toast } from "sonner"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

import { signInSchema } from "@/schemas/signInSchema"

const SignInPage = () => {
  const router = useRouter()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      const res = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      })

      if (res?.error) {
        toast.error("Incorrect email/username or password")
        return
      }

      if (res?.ok) {
        toast.success("Welcome back 👋")
        router.replace("/dashboard")
      }
    } catch {
      toast.error("Something went wrong. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-white/70 backdrop-blur p-8 shadow-lg space-y-6">

        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-semibold text-gray-900">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500">
            Sign in to your anonymous inbox
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >

            {/* Email / Username */}
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email or Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com or username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500"
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-indigo-600 hover:underline"
          >
            Sign up
          </Link>
        </p>

      </div>
    </div>
  )
}

export default SignInPage
