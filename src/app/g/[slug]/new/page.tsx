"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Sparkles, Loader2, X } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

const budgetOptions = [
  { value: 'LOW', label: 'Low', icon: '💰' },
  { value: 'MEDIUM', label: 'Medium', icon: '💳' },
  { value: 'HIGH', label: 'High', icon: '💎' }
];

const monthOptions = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' }
];

export default function CreateIdeaPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    prompt: '',
    budgetLevel: null as string | null,
    kidsFriendly: false,
    monthHint: null as number | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.prompt.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const { createIdea } = await import('@/app/actions');

      const result = await createIdea({
        groupSlug: params.slug,
        prompt: formData.prompt,
        budget: formData.budgetLevel as 'LOW' | 'MEDIUM' | 'HIGH' | undefined,
        kids: formData.kidsFriendly,
        month: formData.monthHint || undefined
      });

      // Show non-blocking toast for moodboard generation
      toast({
        title: "Idea Created!",
        description: "Generating moodboard... This may take a moment.",
        duration: 5000,
      });

      // Start moodboard generation in the background
      generateMoodboard(result.id);

      // Navigate to idea detail page immediately
      router.push(`/i/${result.id}`);
    } catch (error) {
      console.error('Error creating idea:', error);
      toast({
        title: "Error",
        description: "Failed to create idea. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateMoodboard = async (ideaId: string) => {
    try {
      const { generateMoodboard } = await import('@/app/actions');
      await generateMoodboard(ideaId);
    } catch (error) {
      console.error('Error generating moodboard:', error);
      toast({
        title: "Moodboard Generation Failed",
        description: "The idea was created but moodboard generation failed. You can try again later.",
        variant: "destructive",
      });
    }
  };

  const handleBudgetSelect = (budget: string) => {
    setFormData(prev => ({
      ...prev,
      budgetLevel: prev.budgetLevel === budget ? null : budget
    }));
  };

  const handleMonthSelect = (month: number) => {
    setFormData(prev => ({
      ...prev,
      monthHint: prev.monthHint === month ? null : month
    }));
  };

  const removeBudget = () => {
    setFormData(prev => ({ ...prev, budgetLevel: null }));
  };

  const removeMonth = () => {
    setFormData(prev => ({ ...prev, monthHint: null }));
  };

  const toggleKidsFriendly = () => {
    setFormData(prev => ({ ...prev, kidsFriendly: !prev.kidsFriendly }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/g/${params.slug}`}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {params.slug} group
          </Link>

          <h1 className="text-3xl font-bold text-gray-900">Share Your Idea</h1>
          <p className="text-gray-600 mt-2">Describe your travel idea and we&apos;ll help bring it to life</p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                Describe your idea
              </CardTitle>
              <CardDescription>
                Tell us about your travel vision. Be as detailed as you&apos;d like!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Textarea */}
              <div className="space-y-2">
                <Label htmlFor="prompt" className="text-base font-medium">
                  Your Travel Idea
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="A serene beach getaway in the Maldives with overwater bungalows and snorkeling..."
                  className="min-h-[200px] text-base resize-none"
                  value={formData.prompt}
                  onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
                  disabled={isSubmitting}
                  required
                />
                <p className="text-sm text-gray-500">
                  {formData.prompt.length}/500 characters
                </p>
              </div>

              {/* Selected Chips */}
              {(formData.budgetLevel || formData.monthHint || formData.kidsFriendly) && (
                <div className="space-y-2">
                  <Label className="text-base font-medium">Selected Options</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.budgetLevel && (
                      <Badge variant="secondary" className="px-3 py-1">
                        {budgetOptions.find(b => b.value === formData.budgetLevel)?.icon} 
                        {budgetOptions.find(b => b.value === formData.budgetLevel)?.label}
                        <button
                          type="button"
                          onClick={removeBudget}
                          className="ml-2 hover:bg-gray-300 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {formData.monthHint && (
                      <Badge variant="secondary" className="px-3 py-1">
                        📅 {monthOptions.find(m => m.value === formData.monthHint)?.label}
                        <button
                          type="button"
                          onClick={removeMonth}
                          className="ml-2 hover:bg-gray-300 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {formData.kidsFriendly && (
                      <Badge variant="secondary" className="px-3 py-1">
                        👶 Kids-friendly
                        <button
                          type="button"
                          onClick={toggleKidsFriendly}
                          className="ml-2 hover:bg-gray-300 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Option Chips */}
              <div className="space-y-6">
                {/* Budget Level */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Budget Level (Optional)</Label>
                  <div className="flex gap-2">
                    {budgetOptions.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleBudgetSelect(option.value)}
                        disabled={isSubmitting}
                        className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                          formData.budgetLevel === option.value
                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                        } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <span className="mr-2">{option.icon}</span>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preferred Month */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Preferred Month (Optional)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {monthOptions.map(month => (
                      <button
                        key={month.value}
                        type="button"
                        onClick={() => handleMonthSelect(month.value)}
                        disabled={isSubmitting}
                        className={`px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                          formData.monthHint === month.value
                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                        } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {month.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Kids-friendly Switch */}
                <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">👶</span>
                    <div>
                      <Label htmlFor="kids-friendly" className="text-base font-medium">
                        Kids-friendly
                      </Label>
                      <p className="text-sm text-gray-500">This trip is suitable for children</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={toggleKidsFriendly}
                    disabled={isSubmitting}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.kidsFriendly ? 'bg-blue-600' : 'bg-gray-200'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.kidsFriendly ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            type="submit" 
            className="w-full py-3 text-lg" 
            disabled={isSubmitting || !formData.prompt.trim()}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating Idea...
              </>
            ) : (
              "Submit Idea"
            )}
          </Button>
        </motion.form>
      </div>
    </div>
  );
}