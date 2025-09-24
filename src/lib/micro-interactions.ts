'use client'

import { motion, AnimatePresence } from 'framer-motion'

// Particle effects for voting and interactions
export const particleVariants = {
  heart: {
    initial: { 
      scale: 0, 
      opacity: 0, 
      x: 0, 
      y: 0,
      rotate: 0
    },
    animate: {
      scale: [0, 1.2, 1],
      opacity: [0, 1, 0],
      x: [0, -20, 20, -10, 10, 0],
      y: [0, -30, -50, -70, -100],
      rotate: [0, 15, -15, 30, -30, 0],
      transition: {
        duration: 2,
        ease: "easeOut"
      }
    }
  },
  star: {
    initial: { 
      scale: 0, 
      opacity: 0, 
      x: 0, 
      y: 0,
      rotate: 0
    },
    animate: {
      scale: [0, 1.5, 1],
      opacity: [0, 1, 0],
      x: [0, -25, 25, -15, 15, 0],
      y: [0, -35, -60, -85, -120],
      rotate: [0, 180, 360],
      transition: {
        duration: 2.5,
        ease: "easeOut"
      }
    }
  },
  confetti: {
    initial: { 
      scale: 0, 
      opacity: 0, 
      x: 0, 
      y: 0,
      rotate: 0
    },
    animate: {
      scale: [0, 1.3, 1],
      opacity: [0, 1, 0],
      x: [0, -30, 30, -20, 20, 0],
      y: [0, -40, -70, -100, -130],
      rotate: [0, 360, 720],
      transition: {
        duration: 3,
        ease: "easeOut"
      }
    }
  }
}

// Success celebration animations
export const successVariants = {
  checkmark: {
    initial: { 
      scale: 0, 
      opacity: 0,
      pathLength: 0
    },
    animate: {
      scale: [0, 1.2, 1],
      opacity: [0, 1, 1],
      pathLength: [0, 1],
      transition: {
        duration: 0.8,
        ease: "easeOut",
        pathLength: {
          duration: 0.6,
          ease: "easeInOut"
        }
      }
    }
  },
  sparkle: {
    initial: { 
      scale: 0, 
      opacity: 0,
      rotate: 0
    },
    animate: {
      scale: [0, 1.5, 1],
      opacity: [0, 1, 0],
      rotate: [0, 180, 360],
      transition: {
        duration: 1.2,
        ease: "easeOut"
      }
    }
  },
  celebration: {
    initial: { 
      scale: 0, 
      opacity: 0,
      y: 0
    },
    animate: {
      scale: [0, 1.3, 1],
      opacity: [0, 1, 1],
      y: [0, -10, 0],
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    }
  }
}

// Hover animations for revealing details
export const hoverVariants = {
  card: {
    initial: { 
      scale: 1, 
      y: 0,
      rotateX: 0,
      rotateY: 0
    },
    hover: {
      scale: 1.05,
      y: -8,
      rotateX: 5,
      rotateY: 5,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  },
  reveal: {
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.9
    },
    hover: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  },
  glow: {
    initial: { 
      boxShadow: "0 0 0 rgba(59, 130, 246, 0)"
    },
    hover: {
      boxShadow: "0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }
}

// Page transition animations
export const pageTransitions = {
  slideIn: {
    initial: { 
      opacity: 0, 
      x: 100,
      scale: 0.95
    },
    animate: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      x: -100,
      scale: 0.95,
      transition: {
        duration: 0.4,
        ease: "easeIn"
      }
    }
  },
  fadeIn: {
    initial: { 
      opacity: 0, 
      y: 30
    },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -30,
      transition: {
        duration: 0.4,
        ease: "easeIn"
      }
    }
  },
  parallax: {
    initial: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    }
  }
}

// Travel-themed loading animations
export const loadingVariants = {
  airplane: {
    initial: { 
      x: -100, 
      y: 0,
      rotate: 0
    },
    animate: {
      x: [0, 100, 0],
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },
  suitcase: {
    initial: { 
      scale: 1, 
      y: 0
    },
    animate: {
      scale: [1, 1.1, 1],
      y: [0, -10, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },
  passport: {
    initial: { 
      rotate: 0, 
      scale: 1
    },
    animate: {
      rotate: [0, 5, -5, 0],
      scale: [1, 1.05, 1],
      transition: {
        duration: 1.8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }
}

// Ripple effect for button interactions
export const rippleVariants = {
  initial: { 
    scale: 0, 
    opacity: 0.6
  },
  animate: {
    scale: 4,
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

// Stagger animations for lists
export const staggerVariants = {
  container: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },
  item: {
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.9
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }
}

// Utility functions for triggering animations
export const triggerParticleEffect = (type: 'heart' | 'star' | 'confetti', element: HTMLElement) => {
  const rect = element.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  
  // Create particle elements
  for (let i = 0; i < 5; i++) {
    const particle = document.createElement('div')
    particle.className = `absolute pointer-events-none z-50 ${
      type === 'heart' ? 'text-red-500' : 
      type === 'star' ? 'text-yellow-500' : 
      'text-purple-500'
    }`
    particle.style.left = `${centerX}px`
    particle.style.top = `${centerY}px`
    particle.innerHTML = type === 'heart' ? '❤️' : type === 'star' ? '⭐' : '🎉'
    
    document.body.appendChild(particle)
    
    // Animate particle
    const animation = particle.animate([
      { 
        transform: 'translate(0, 0) scale(0) rotate(0deg)',
        opacity: 0
      },
      { 
        transform: `translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 100}px) scale(1) rotate(360deg)`,
        opacity: 1
      },
      { 
        transform: `translate(${(Math.random() - 0.5) * 200}px, ${(Math.random() - 0.5) * 200}px) scale(0) rotate(720deg)`,
        opacity: 0
      }
    ], {
      duration: 2000,
      easing: 'ease-out'
    })
    
    animation.onfinish = () => {
      document.body.removeChild(particle)
    }
  }
}

export const triggerSuccessCelebration = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  
  // Create celebration overlay
  const overlay = document.createElement('div')
  overlay.className = 'fixed inset-0 pointer-events-none z-50 flex items-center justify-center'
  overlay.style.background = 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)'
  
  document.body.appendChild(overlay)
  
  // Animate overlay
  const animation = overlay.animate([
    { opacity: 0, transform: 'scale(0.5)' },
    { opacity: 1, transform: 'scale(1.2)' },
    { opacity: 0, transform: 'scale(1.5)' }
  ], {
    duration: 1500,
    easing: 'ease-out'
  })
  
  animation.onfinish = () => {
    document.body.removeChild(overlay)
  }
}
