'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Mail } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      // TODO: Implement actual Supabase magic link authentication
      // For now, just simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMessage('Check your email for the magic link!')
    } catch (error) {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 -mt-16">
      <div className="w-full max-w-md">
        {/* Back to home link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to MoodTrip
        </Link>

        {/* Login Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>
              Enter your email to receive a magic link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !email}
              >
                {isLoading ? 'Sending...' : 'Send magic link'}
              </Button>

              {message && (
                <div className={`text-sm text-center p-3 rounded-md ${
                  message.includes('Check your email') 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {message}
                </div>
              )}
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <span className="text-blue-600 font-medium">
                  Sign up with the same process
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}
