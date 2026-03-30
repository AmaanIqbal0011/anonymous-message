"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifySchema } from "@/schemas/verifySchema";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, ArrowRight } from "lucide-react";

const VerifyPage = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post("/api/verify-code", {
        username: params.username,
        code: data.code,
      });
      toast.success(response.data.message);
      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast.error(errorMessage || "Something went wrong during verification");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">

      {/* Decorative bg */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 h-80 w-80 rounded-full bg-emerald-100 opacity-30 blur-3xl" />
        <div className="absolute bottom-1/4 -left-20 h-64 w-64 rounded-full bg-indigo-100 opacity-30 blur-3xl" />
      </div>

      <div className="relative flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8 animate-slide-up">

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-emerald-600 text-white mb-2 shadow-lg shadow-emerald-200">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Verify your account
            </h1>
            <p className="text-gray-500">
              We sent a verification code to your email
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl bg-white border border-gray-100 shadow-xl shadow-gray-200/50 p-6 sm:p-8">

            {/* Info Banner */}
            <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-4 mb-6">
              <p className="text-sm text-indigo-700">
                Enter the 6-digit code sent to verify <strong className="font-semibold">@{params.username}</strong>
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Verification Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="000000"
                          maxLength={6}
                          className="rounded-xl h-12 bg-gray-50/50 border-gray-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400 text-center text-xl tracking-[0.3em] font-mono"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all font-semibold"
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying…
                    </>
                  ) : (
                    <>
                      Verify Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>

          {/* Help text */}
          <p className="text-center text-sm text-gray-400">
            Didn&apos;t receive a code? Check your spam folder.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;
