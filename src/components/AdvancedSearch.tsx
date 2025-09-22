'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, X, Calendar, DollarSign, Users } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'

interface SearchFilters {
  query: string
  budget: string[]
  months: number[]
  tags: string[]
  sortBy: 'newest' | 'oldest' | 'popular' | 'budget'
}

interface AdvancedSearchProps {
  onFiltersChange: (filters: SearchFilters) => void
  availableTags: string[]
}

export function AdvancedSearch({ onFiltersChange, availableTags }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    budget: [],
    months: [],
    tags: [],
    sortBy: 'newest'
  })
  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      query: '',
      budget: [],
      months: [],
      tags: [],
      sortBy: 'newest' as const
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const activeFiltersCount = useMemo(() => {
    return filters.budget.length + filters.months.length + filters.tags.length
  }, [filters])

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search ideas, destinations, activities..."
          value={filters.query}
          onChange={(e) => handleFilterChange('query', e.target.value)}
          className="pl-10 pr-4"
        />
        {filters.query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFilterChange('query', '')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear all
          </Button>
        )}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          {/* Budget Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Budget
            </label>
            <div className="space-y-2">
              {['LOW', 'MEDIUM', 'HIGH'].map((budget) => (
                <label key={budget} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.budget.includes(budget)}
                    onChange={(e) => {
                      const newBudget = e.target.checked
                        ? [...filters.budget, budget]
                        : filters.budget.filter(b => b !== budget)
                      handleFilterChange('budget', newBudget)
                    }}
                    className="rounded"
                  />
                  <span className="text-sm capitalize">{budget.toLowerCase()}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Month Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Travel Months
            </label>
            <div className="grid grid-cols-2 gap-1">
              {Array.from({ length: 12 }, (_, i) => {
                const month = new Date(2024, i).toLocaleString('default', { month: 'short' })
                return (
                  <label key={i} className="flex items-center space-x-1 text-xs">
                    <input
                      type="checkbox"
                      checked={filters.months.includes(i + 1)}
                      onChange={(e) => {
                        const newMonths = e.target.checked
                          ? [...filters.months, i + 1]
                          : filters.months.filter(m => m !== i + 1)
                        handleFilterChange('months', newMonths)
                      }}
                      className="rounded"
                    />
                    <span>{month}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Tags Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Tags
            </label>
            <div className="flex flex-wrap gap-1">
              {availableTags.slice(0, 10).map((tag) => (
                <Badge
                  key={tag}
                  variant={filters.tags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => {
                    const newTags = filters.tags.includes(tag)
                      ? filters.tags.filter(t => t !== tag)
                      : [...filters.tags, tag]
                    handleFilterChange('tags', newTags)
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sort Options */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Sort by:</span>
        <Select value={filters.sortBy} onValueChange={(value: any) => handleFilterChange('sortBy', value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="budget">Budget</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
