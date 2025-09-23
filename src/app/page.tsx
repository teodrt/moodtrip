'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Globe, Heart, Star, Zap } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Premium Animated Background - Travel Inspired */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main floating orbs with travel-inspired movement */}
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 10, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            x: [0, -25, 15, 0],
            y: [0, 25, -15, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            x: [0, 20, -30, 0],
            y: [0, -15, 25, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
        
        {/* Floating travel particles */}
        <motion.div 
          className="absolute top-20 left-20 w-4 h-4 bg-white/20 rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-40 right-32 w-6 h-6 bg-purple-400/30 rounded-full"
          animate={{
            y: [0, -25, 0],
            x: [0, 10, 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute bottom-32 left-32 w-3 h-3 bg-pink-400/40 rounded-full"
          animate={{
            y: [0, -30, 0],
            x: [0, -15, 0],
            opacity: [0.4, 0.9, 0.4],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-5 h-5 bg-yellow-400/30 rounded-full"
          animate={{
            y: [0, -35, 0],
            x: [0, 20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
        
        {/* Gentle wave patterns */}
        <motion.div 
          className="absolute top-1/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute top-3/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent"
          animate={{
            x: ['100%', '-100%'],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
            delay: 5
          }}
        />
        
        {/* Subtle parallax layers */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"
          animate={{
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto text-center">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-16"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 mb-8"
            >
              <span className="text-4xl">🧳</span>
            </motion.div>
            
            <h1 className="text-hero font-display text-white mb-6 text-balance">
              MoodTrip
            </h1>
            <p className="text-subtitle text-white/80 mb-12 max-w-3xl mx-auto text-balance">
              AI-Powered Travel Planning that transforms your dreams into reality
            </p>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            {[
              {
                icon: <Sparkles className="h-8 w-8" />,
                title: "AI-Powered",
                description: "Intelligent recommendations based on your preferences"
              },
              {
                icon: <Globe className="h-8 w-8" />,
                title: "Global Reach",
                description: "Discover destinations from around the world"
              },
              {
                icon: <Heart className="h-8 w-8" />,
                title: "Personalized",
                description: "Tailored experiences just for you"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.2 }}
                className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 hover:border-white/30 transition-all duration-300"
              >
                <div className="text-white/90 mb-4">{feature.icon}</div>
                <h3 className="text-title font-heading text-white mb-3">{feature.title}</h3>
                <p className="text-body text-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/g/family"
                className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-2xl text-subtitle font-medium shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 flex items-center"
              >
                <Globe className="h-6 w-6 mr-3" />
                View Family Group
                <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/g/family/new"
                className="group bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/50 px-8 py-4 rounded-2xl text-subtitle font-medium backdrop-blur-xl transition-all duration-300 flex items-center"
              >
                <Zap className="h-6 w-6 mr-3" />
                Create New Idea
                <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { number: "10K+", label: "Ideas Created" },
              { number: "50+", label: "Countries" },
              { number: "99%", label: "Satisfaction" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-white/60 text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-white/20 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-32 w-6 h-6 bg-purple-400/30 rounded-full animate-pulse animation-delay-1000"></div>
      <div className="absolute bottom-32 left-32 w-3 h-3 bg-pink-400/40 rounded-full animate-pulse animation-delay-2000"></div>
      <div className="absolute bottom-20 right-20 w-5 h-5 bg-yellow-400/30 rounded-full animate-pulse animation-delay-3000"></div>
    </div>
  )
}