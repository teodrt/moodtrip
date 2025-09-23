import { getGroupAvailability } from "@/app/actions";
import { AvailabilityForm } from "./AvailabilityForm";
import { GroupHeatmap } from "./GroupHeatmap";
import { motion } from "framer-motion";
import { Calendar, Users, TrendingUp, BarChart3, Clock, Target, Zap, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function AvailabilityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const groupAvailability = await getGroupAvailability(slug);

  if (!groupAvailability) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-12 border border-white/20">
            <h1 className="text-3xl font-display text-white mb-4">Group Not Found</h1>
            <p className="text-white/60 text-lg mb-6">The group you're looking for doesn't exist.</p>
            <Link href="/">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-2xl">
                Go Home
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Premium Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs with sophisticated movement */}
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 10, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, -25, 15, 0],
            y: [0, 25, -15, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
        <motion.div 
          className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, 20, -30, 0],
            y: [0, -15, 25, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6
          }}
        />

        {/* Floating particles */}
        <motion.div 
          className="absolute top-20 left-20 w-3 h-3 bg-white/20 rounded-full"
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
          className="absolute top-40 right-32 w-4 h-4 bg-purple-400/30 rounded-full"
          animate={{
            y: [0, -25, 0],
            x: [0, 10, 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute bottom-32 left-32 w-2 h-2 bg-pink-400/40 rounded-full"
          animate={{
            y: [0, -30, 0],
            x: [0, -15, 0],
            opacity: [0.4, 0.9, 0.4],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Premium Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12"
        >
          <Link
            href={`/g/${slug}`}
            className="inline-flex items-center text-sm text-white/60 hover:text-white/80 transition-colors mb-6 group"
          >
            <motion.div
              whileHover={{ x: -2 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
            </motion.div>
            Back to {groupAvailability.groupName}
          </Link>

          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-5xl font-display text-white mb-4 text-balance">
                Availability for {groupAvailability.groupName}
              </h1>
              <p className="text-xl text-white/70 mb-8 text-balance">
                Set your availability for each month and see the group's overall availability
              </p>
            </motion.div>

            {/* Premium Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
            >
              <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Group</p>
                    <p className="text-white font-medium">{groupAvailability.groupName}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Users className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Members</p>
                    <p className="text-white font-medium">{groupAvailability.groupAvailability.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Best Month</p>
                    <p className="text-white font-medium">March</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                    <Target className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Avg. Score</p>
                    <p className="text-white font-medium">75%</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Personal Availability Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Clock className="h-5 w-5 text-blue-400" />
                </div>
                <h2 className="text-2xl font-display text-white">Your Availability</h2>
              </div>
              <AvailabilityForm 
                groupId={groupAvailability.groupId}
                initialAvailability={groupAvailability.userAvailability}
              />
            </div>
          </motion.div>

          {/* Group Heatmap */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-purple-400" />
                </div>
                <h2 className="text-2xl font-display text-white">Group Availability</h2>
              </div>
              <GroupHeatmap groupAvailability={groupAvailability.groupAvailability} />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
