import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

function Card({ 
  className, 
  variant = 'default',
  gradient = 'primary',
  hoverable = false,
  ...props 
}: React.ComponentProps<"div"> & {
  variant?: 'default' | 'glass' | 'gradient' | 'elevated' | 'premium'
  gradient?: 'primary' | 'sunset' | 'ocean' | 'forest' | 'aurora' | 'midnight' | 'gold' | 'rose' | 'cosmic'
  hoverable?: boolean
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'glass':
        return 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl'
      case 'gradient':
        return `bg-gradient-to-br ${gradient === 'primary' ? 'from-blue-500/20 to-purple-600/20' : 
                gradient === 'sunset' ? 'from-pink-500/20 to-red-500/20' :
                gradient === 'ocean' ? 'from-cyan-500/20 to-blue-500/20' :
                gradient === 'forest' ? 'from-green-500/20 to-emerald-500/20' :
                gradient === 'aurora' ? 'from-purple-500/20 to-pink-500/20' :
                gradient === 'midnight' ? 'from-slate-500/20 to-gray-500/20' :
                gradient === 'gold' ? 'from-yellow-500/20 to-orange-500/20' :
                gradient === 'rose' ? 'from-rose-500/20 to-pink-500/20' :
                gradient === 'cosmic' ? 'from-blue-500/20 via-purple-500/20 to-pink-500/20' :
                'from-blue-500/20 to-purple-600/20'} backdrop-blur-xl border border-white/20 shadow-2xl`
      case 'elevated':
        return 'bg-white shadow-2xl border border-gray-100'
      case 'premium':
        return 'bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border border-white/30 shadow-2xl'
      default:
        return 'bg-white shadow-lg border border-gray-200'
    }
  }

  const Component = hoverable ? motion.div : 'div'
  const motionProps = hoverable ? {
    whileHover: { y: -4, scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2, ease: "easeOut" }
  } : {}

  return (
    <Component
      data-slot="card"
      className={cn(
        "text-card-foreground flex flex-col gap-6 rounded-2xl py-6 transition-all duration-300",
        getVariantStyles(),
        hoverable && 'cursor-pointer',
        className
      )}
      {...motionProps}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
