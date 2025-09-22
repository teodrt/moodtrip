"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { User, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AuthButton() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <Button variant="outline" disabled>
        <User className="h-4 w-4 mr-2" />
        Loading...
      </Button>
    )
  }

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={session.user?.image || ""} />
          <AvatarFallback>
            {session.user?.name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm text-gray-700 hidden sm:block">
          {session.user?.name || session.user?.email}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={() => signIn()}>
      <User className="h-4 w-4 mr-2" />
      Sign In
    </Button>
  )
}
