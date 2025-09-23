import { render, screen } from '@testing-library/react'
import { LoadingSpinner, IdeaCardSkeleton, MoodboardGeneration } from '../LoadingStates'

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />)
    const spinner = screen.getByRole('status', { hidden: true })
    expect(spinner).toBeInTheDocument()
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />)
    expect(screen.getByRole('status', { hidden: true })).toHaveClass('h-4 w-4')

    rerender(<LoadingSpinner size="md" />)
    expect(screen.getByRole('status', { hidden: true })).toHaveClass('h-6 w-6')

    rerender(<LoadingSpinner size="lg" />)
    expect(screen.getByRole('status', { hidden: true })).toHaveClass('h-8 w-8')
  })

  it('renders with different variants', () => {
    const { rerender } = render(<LoadingSpinner variant="default" />)
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument()

    rerender(<LoadingSpinner variant="pulse" />)
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument()

    rerender(<LoadingSpinner variant="bounce" />)
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<LoadingSpinner className="custom-class" />)
    expect(screen.getByRole('status', { hidden: true })).toHaveClass('custom-class')
  })
})

describe('IdeaCardSkeleton', () => {
  it('renders with default variant', () => {
    render(<IdeaCardSkeleton />)
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument()
  })

  it('renders with different variants', () => {
    const { rerender } = render(<IdeaCardSkeleton variant="minimal" />)
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument()

    rerender(<IdeaCardSkeleton variant="detailed" />)
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument()

    rerender(<IdeaCardSkeleton variant="default" />)
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<IdeaCardSkeleton className="custom-class" />)
    expect(screen.getByRole('status', { hidden: true })).toHaveClass('custom-class')
  })
})

describe('MoodboardGeneration', () => {
  it('renders with images step', () => {
    render(<MoodboardGeneration step="images" />)
    expect(screen.getByText('Creating Your Moodboard')).toBeInTheDocument()
    expect(screen.getByText('Generating Images')).toBeInTheDocument()
  })

  it('renders with summary step', () => {
    render(<MoodboardGeneration step="summary" />)
    expect(screen.getByText('Creating Summary')).toBeInTheDocument()
  })

  it('renders with tags step', () => {
    render(<MoodboardGeneration step="tags" />)
    expect(screen.getByText('Extracting Tags')).toBeInTheDocument()
  })

  it('renders with palette step', () => {
    render(<MoodboardGeneration step="palette" />)
    expect(screen.getByText('Analyzing Colors')).toBeInTheDocument()
  })

  it('renders with complete step', () => {
    render(<MoodboardGeneration step="complete" />)
    expect(screen.getByText('Moodboard Complete!')).toBeInTheDocument()
    expect(screen.getByText('Your travel vision has been brought to life!')).toBeInTheDocument()
  })

  it('shows progress bar when progress is provided', () => {
    render(<MoodboardGeneration step="images" progress={50} />)
    expect(screen.getByText('Progress')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('shows view moodboard button when complete', () => {
    render(<MoodboardGeneration step="complete" />)
    expect(screen.getByText('View Moodboard')).toBeInTheDocument()
  })
})
