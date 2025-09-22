'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles, Loader2, X, Wand2, Globe, Calendar, DollarSign, Baby } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'

const budgetOptions = [
  { value: 'LOW', label: 'Economy', icon: '💰', description: 'Budget-friendly options' },
  { value: 'MEDIUM', label: 'Premium', icon: '💳', description: 'Comfortable experience' },
  { value: 'HIGH', label: 'Luxury', icon: '💎', description: 'High-end indulgence' }
]

const monthOptions = [
  { value: 1, label: 'January', season: 'Winter' },
  { value: 2, label: 'February', season: 'Winter' },
  { value: 3, label: 'March', season: 'Spring' },
  { value: 4, label: 'April', season: 'Spring' },
  { value: 5, label: 'May', season: 'Spring' },
  { value: 6, label: 'June', season: 'Summer' },
  { value: 7, label: 'July', season: 'Summer' },
  { value: 8, label: 'August', season: 'Summer' },
  { value: 9, label: 'September', season: 'Autumn' },
  { value: 10, label: 'October', season: 'Autumn' },
  { value: 11, label: 'November', season: 'Autumn' },
  { value: 12, label: 'December', season: 'Winter' }
]

interface LuxuryCreateIdeaFormProps {
  slug: string
}

export function LuxuryCreateIdeaForm({ slug }: LuxuryCreateIdeaFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    prompt: '',
    budgetLevel: null as string | null,
    kidsFriendly: false,
    monthHint: null as number | null
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.prompt.trim() || isSubmitting) return

    setIsSubmitting(true)

    try {
      const { createIdea } = await import('@/app/actions')

      const result = await createIdea({
        groupSlug: slug,
        prompt: formData.prompt,
        budget: formData.budgetLevel as 'LOW' | 'MEDIUM' | 'HIGH' | undefined,
        kids: formData.kidsFriendly,
        month: formData.monthHint || undefined
      })

      toast({
        title: "✨ Idea Created!",
        description: "Your travel vision is coming to life...",
        duration: 2000,
      })

      setTimeout(() => {
        router.push(`/i/${result.id}`)
      }, 500)
    } catch (error) {
      console.error('Error creating idea:', error)
      toast({
        title: "Error",
        description: "Failed to create idea. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const handleBudgetSelect = (budget: string) => {
    setFormData(prev => ({
      ...prev,
      budgetLevel: prev.budgetLevel === budget ? null : budget
    }))
  }

  const handleMonthSelect = (month: number) => {
    setFormData(prev => ({
      ...prev,
      monthHint: prev.monthHint === month ? null : month
    }))
  }

  const removeBudget = () => {
    setFormData(prev => ({ ...prev, budgetLevel: null }))
  }

  const removeMonth = () => {
    setFormData(prev => ({ ...prev, monthHint: null }))
  }

  const toggleKidsFriendly = () => {
    setFormData(prev => ({ ...prev, kidsFriendly: !prev.kidsFriendly }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 30px 30px, #9C92AC 2px, transparent 2px)`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Link
            href={`/g/${slug}`}
            className="inline-flex items-center text-sm text-white/70 hover:text-white transition-all duration-300 mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to {slug} group
          </Link>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-2xl">
              <Wand2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-light text-white mb-4 tracking-tight">
              Share Your Vision
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Describe your dream travel experience and we'll bring it to life with AI-powered insights
            </p>
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8"
        >
          {/* Main Prompt Card */}
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl text-white">
                <Sparkles className="h-6 w-6 text-purple-400" />
                Your Travel Vision
              </CardTitle>
              <CardDescription className="text-white/70 text-lg">
                Paint a picture of your ideal travel experience. Be as detailed as you'd like!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="prompt" className="text-lg font-medium text-white">
                  Describe your dream trip
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="A serene beach getaway in the Maldives with overwater bungalows, crystal-clear waters for snorkeling, and romantic sunset dinners..."
                  className="min-h-[200px] text-lg resize-none bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400/20"
                  value={formData.prompt}
                  onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
                  disabled={isSubmitting}
                  required
                />
                <div className="flex justify-between items-center">
                  <p className="text-sm text-white/60">
                    {formData.prompt.length}/500 characters
                  </p>
                  <div className="text-sm text-white/60">
                    ✨ AI will enhance your description
                  </div>
                </div>
              </div>

              {/* Selected Options */}
              {(formData.budgetLevel || formData.monthHint || formData.kidsFriendly) && (
                <div className="space-y-3">
                  <Label className="text-lg font-medium text-white">Selected Options</Label>
                  <div className="flex flex-wrap gap-3">
                    {formData.budgetLevel && (
                      <Badge 
                        variant="secondary" 
                        className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300"
                      >
                        {budgetOptions.find(b => b.value === formData.budgetLevel)?.icon} 
                        {budgetOptions.find(b => b.value === formData.budgetLevel)?.label}
                        <button
                          type="button"
                          onClick={removeBudget}
                          className="ml-3 hover:bg-white/20 rounded-full p-1 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {formData.monthHint && (
                      <Badge 
                        variant="secondary" 
                        className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300"
                      >
                        📅 {monthOptions.find(m => m.value === formData.monthHint)?.label}
                        <button
                          type="button"
                          onClick={removeMonth}
                          className="ml-3 hover:bg-white/20 rounded-full p-1 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {formData.kidsFriendly && (
                      <Badge 
                        variant="secondary" 
                        className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-white border border-green-400/30 hover:border-green-400/50 transition-all duration-300"
                      >
                        👶 Kids-friendly
                        <button
                          type="button"
                          onClick={toggleKidsFriendly}
                          className="ml-3 hover:bg-white/20 rounded-full p-1 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Options Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Budget Level */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg text-white">
                  <DollarSign className="h-5 w-5 text-green-400" />
                  Budget Level
                </CardTitle>
                <CardDescription className="text-white/70">
                  Choose your comfort level
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {budgetOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleBudgetSelect(option.value)}
                    disabled={isSubmitting}
                    className={`w-full p-4 rounded-xl border transition-all duration-300 text-left ${
                      formData.budgetLevel === option.value
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/50 text-white shadow-lg'
                        : 'bg-white/5 border-white/20 text-white/80 hover:border-white/40 hover:bg-white/10'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.icon}</span>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm opacity-70">{option.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Preferred Month */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg text-white">
                  <Calendar className="h-5 w-5 text-blue-400" />
                  Preferred Month
                </CardTitle>
                <CardDescription className="text-white/70">
                  When would you like to travel?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {monthOptions.map(month => (
                    <button
                      key={month.value}
                      type="button"
                      onClick={() => handleMonthSelect(month.value)}
                      disabled={isSubmitting}
                      className={`p-3 rounded-lg border transition-all duration-300 text-center ${
                        formData.monthHint === month.value
                          ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-400/50 text-white shadow-lg'
                          : 'bg-white/5 border-white/20 text-white/80 hover:border-white/40 hover:bg-white/10'
                      } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="font-medium text-sm">{month.label}</div>
                      <div className="text-xs opacity-70">{month.season}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Kids-friendly */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg text-white">
                  <Baby className="h-5 w-5 text-green-400" />
                  Family Friendly
                </CardTitle>
                <CardDescription className="text-white/70">
                  Suitable for children?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/20">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">👶</span>
                    <div>
                      <div className="font-medium text-white">Kids-friendly</div>
                      <div className="text-sm text-white/70">This trip is suitable for children</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={toggleKidsFriendly}
                    disabled={isSubmitting}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.kidsFriendly ? 'bg-green-500' : 'bg-white/20'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.kidsFriendly ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <Button 
              type="submit" 
              className="w-full py-6 text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 rounded-2xl border border-purple-400/20"
              disabled={isSubmitting || !formData.prompt.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                  Creating Your Vision...
                </>
              ) : (
                <>
                  <Wand2 className="mr-3 h-6 w-6" />
                  Bring My Vision to Life
                </>
              )}
            </Button>
            
            {isSubmitting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-white/70 mt-4"
              >
                ✨ AI is crafting your perfect travel experience...
              </motion.div>
            )}
          </motion.div>
        </motion.form>
      </div>
    </div>
  )
}
