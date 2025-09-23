'use client'

import { Button } from "@/components/ui/button";
import { Plus, Calendar, Sparkles, Users, Globe, Heart, Filter, SortAsc, Grid3X3, List, Search, Star, TrendingUp, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { IdeaCard } from "@/components/IdeaCard";
import { EmptyIdeasFeed } from "@/components/EmptyStates";
import { getIdeasByGroupSlug } from "@/app/actions";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function GroupFeedPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string>('');
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    params.then(async (resolvedParams) => {
      setSlug(resolvedParams.slug);
      try {
        const ideasData = await getIdeasByGroupSlug(resolvedParams.slug);
        setIdeas(ideasData);
      } catch (error) {
        console.error('Error fetching ideas:', error);
      } finally {
        setLoading(false);
      }
    });
  }, [params]);

  // Get all unique tags from ideas
  const allTags = Array.from(new Set(ideas.flatMap(idea => idea.tags || [])));

  // Filter and sort ideas
  const filteredAndSortedIdeas = ideas
    .filter(idea => {
      const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           idea.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTags = filterTags.length === 0 || 
                          filterTags.some(tag => idea.tags?.includes(tag));
      return matchesSearch && matchesTags;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'popular':
          return (b.votes?.up || 0) - (a.votes?.up || 0);
        case 'trending':
          return (b.votes?.up + b.votes?.maybe || 0) - (a.votes?.up + a.votes?.maybe || 0);
        default:
          return 0;
      }
    });

  const toggleTagFilter = (tag: string) => {
    setFilterTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
          <p className="text-white/80 text-lg">Loading amazing ideas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Premium Travel-Inspired Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main floating orbs with gentle travel movement */}
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            x: [0, 25, -15, 0],
            y: [0, -15, 8, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            x: [0, -20, 12, 0],
            y: [0, 20, -12, 0],
            scale: [1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
        <motion.div 
          className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            x: [0, 18, -25, 0],
            y: [0, -12, 20, 0],
            scale: [1, 1.02, 0.98, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />
        
        {/* Floating travel particles */}
        <motion.div 
          className="absolute top-16 left-16 w-3 h-3 bg-white/15 rounded-full"
          animate={{
            y: [0, -15, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-32 right-24 w-4 h-4 bg-purple-400/25 rounded-full"
          animate={{
            y: [0, -20, 0],
            x: [0, 8, 0],
            opacity: [0.15, 0.5, 0.15],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute bottom-24 left-24 w-2 h-2 bg-pink-400/30 rounded-full"
          animate={{
            y: [0, -25, 0],
            x: [0, -12, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute bottom-16 right-16 w-4 h-4 bg-yellow-400/20 rounded-full"
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2.5
          }}
        />
        
        {/* Gentle wave patterns */}
        <motion.div 
          className="absolute top-1/3 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/8 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute top-2/3 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400/15 to-transparent"
          animate={{
            x: ['100%', '-100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
            delay: 6
          }}
        />
        
        {/* Subtle parallax layers */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-transparent via-white/3 to-transparent"
          animate={{
            opacity: [0.05, 0.2, 0.05],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Premium Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 mb-6"
              >
                <Users className="h-8 w-8 text-white" />
              </motion.div>
              
              <h1 className="text-display font-display text-white mb-4 text-balance">
                {slug.charAt(0).toUpperCase() + slug.slice(1)} Group
              </h1>
              <p className="text-subtitle text-white/80 max-w-2xl text-balance">
                Discover and share amazing travel ideas with your group
              </p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            >
              <Link href={`/g/${slug}/availability`}>
                <Button 
                  variant="outline" 
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50 backdrop-blur-xl transition-all duration-300 px-6 py-3 rounded-2xl"
                >
                  <Calendar className="h-5 w-5 mr-3" />
                  <span className="text-caption font-medium">Availability</span>
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {[
              { icon: <Sparkles className="h-6 w-6" />, label: "Ideas", value: ideas.length },
              { icon: <Heart className="h-6 w-6" />, label: "Loved", value: "24" },
              { icon: <Globe className="h-6 w-6" />, label: "Countries", value: "12" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.2 }}
                className="bg-white/10 backdrop-blur-2xl rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-white/90">{stat.icon}</div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-white/70 text-sm">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Advanced Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.7 }}
          className="mb-8"
        >
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                <Input
                  placeholder="Search ideas, tags, or destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-white/40 focus:ring-white/20 rounded-2xl"
                />
              </div>

              {/* Sort and View Controls */}
              <div className="flex gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="newest" className="text-white">Newest</SelectItem>
                    <SelectItem value="oldest" className="text-white">Oldest</SelectItem>
                    <SelectItem value="popular" className="text-white">Most Popular</SelectItem>
                    <SelectItem value="trending" className="text-white">Trending</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex bg-white/10 rounded-2xl p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="bg-white/20 text-white hover:bg-white/30 rounded-xl"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="bg-white/20 text-white hover:bg-white/30 rounded-xl"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-2xl"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 pt-6 border-t border-white/20"
                >
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-white/80 text-sm font-medium mb-3">Filter by Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {allTags.map((tag) => (
                          <Badge
                            key={tag}
                            variant={filterTags.includes(tag) ? 'default' : 'outline'}
                            className={`cursor-pointer transition-all duration-200 ${
                              filterTags.includes(tag)
                                ? 'bg-white/20 text-white border-white/40'
                                : 'bg-white/5 text-white/70 border-white/20 hover:bg-white/10'
                            }`}
                            onClick={() => toggleTagFilter(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Results Count and Active Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <p className="text-white/70">
                {filteredAndSortedIdeas.length} of {ideas.length} ideas
              </p>
              {filterTags.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-white/60 text-sm">Filtered by:</span>
                  {filterTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-white/10 text-white/80 border-white/20"
                    >
                      {tag}
                      <button
                        onClick={() => toggleTagFilter(tag)}
                        className="ml-2 hover:text-white"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Ideas Grid/List */}
        {filteredAndSortedIdeas.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center py-16"
          >
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-12 border border-white/20">
              <Search className="h-16 w-16 text-white/40 mx-auto mb-4" />
              <h3 className="text-2xl font-display text-white mb-2">No ideas found</h3>
              <p className="text-white/60 mb-6">
                {searchQuery || filterTags.length > 0 
                  ? "Try adjusting your search or filters"
                  : "Be the first to share an amazing travel idea!"
                }
              </p>
              <Link href={`/g/${slug}/new`}>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-2xl">
                  <Plus className="h-5 w-5 mr-2" />
                  Create First Idea
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
            className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch auto-rows-fr'
                : 'space-y-4'
            }`}
          >
            <AnimatePresence mode="popLayout">
              {filteredAndSortedIdeas.map((idea, index) => (
                <motion.div
                  key={idea.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 * index }}
                  className="h-full"
                >
                  <IdeaCard idea={idea} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Premium Floating Action Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 1 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <Link href={`/g/${slug}/new`}>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Button 
                size="icon" 
                className="w-16 h-16 rounded-3xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border border-white/20"
              >
                <Plus className="h-8 w-8" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-white/20 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-32 w-6 h-6 bg-purple-400/30 rounded-full animate-pulse animation-delay-1000"></div>
      <div className="absolute bottom-32 left-32 w-3 h-3 bg-pink-400/40 rounded-full animate-pulse animation-delay-2000"></div>
      <div className="absolute bottom-20 right-20 w-5 h-5 bg-yellow-400/30 rounded-full animate-pulse animation-delay-3000"></div>
    </div>
  );
}