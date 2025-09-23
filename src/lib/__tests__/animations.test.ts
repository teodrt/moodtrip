import {
  pageVariants,
  cardVariants,
  staggerContainer,
  staggerItem,
  loadingVariants,
  pulseVariants,
  slideInFromLeft,
  slideInFromRight,
  slideInFromBottom,
  modalVariants,
  backdropVariants,
  toastVariants,
  buttonVariants,
  iconVariants,
  progressVariants,
  fadeIn,
  fadeInUp,
  fadeInDown,
  scaleIn,
  bounceIn,
  shakeVariants,
  floatVariants,
  glowVariants
} from '../animations'

describe('Animation Variants', () => {
  describe('pageVariants', () => {
    it('has correct initial state', () => {
      expect(pageVariants.initial).toEqual({
        opacity: 0,
        y: 20,
        scale: 0.98
      })
    })

    it('has correct in state', () => {
      expect(pageVariants.in).toEqual({
        opacity: 1,
        y: 0,
        scale: 1
      })
    })

    it('has correct out state', () => {
      expect(pageVariants.out).toEqual({
        opacity: 0,
        y: -20,
        scale: 1.02
      })
    })
  })

  describe('cardVariants', () => {
    it('has correct hidden state', () => {
      expect(cardVariants.hidden).toEqual({
        opacity: 0,
        y: 20,
        scale: 0.95
      })
    })

    it('has correct visible state', () => {
      expect(cardVariants.visible).toEqual({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.3,
          ease: 'easeOut'
        }
      })
    })

    it('has correct hover state', () => {
      expect(cardVariants.hover).toEqual({
        y: -5,
        scale: 1.02,
        transition: {
          duration: 0.2,
          ease: 'easeOut'
        }
      })
    })

    it('has correct tap state', () => {
      expect(cardVariants.tap).toEqual({
        scale: 0.98,
        transition: {
          duration: 0.1
        }
      })
    })
  })

  describe('staggerContainer', () => {
    it('has correct hidden state', () => {
      expect(staggerContainer.hidden).toEqual({
        opacity: 0
      })
    })

    it('has correct visible state with stagger children', () => {
      expect(staggerContainer.visible).toEqual({
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.1
        }
      })
    })
  })

  describe('staggerItem', () => {
    it('has correct hidden state', () => {
      expect(staggerItem.hidden).toEqual({
        opacity: 0,
        y: 20
      })
    })

    it('has correct visible state', () => {
      expect(staggerItem.visible).toEqual({
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.3,
          ease: 'easeOut'
        }
      })
    })
  })

  describe('loadingVariants', () => {
    it('has correct animate state', () => {
      expect(loadingVariants.animate).toEqual({
        rotate: 360,
        transition: {
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }
      })
    })
  })

  describe('pulseVariants', () => {
    it('has correct animate state', () => {
      expect(pulseVariants.animate).toEqual({
        scale: [1, 1.05, 1],
        opacity: [0.7, 1, 0.7],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      })
    })
  })

  describe('slide animations', () => {
    it('slideInFromLeft has correct states', () => {
      expect(slideInFromLeft.hidden).toEqual({
        x: -100,
        opacity: 0
      })
      expect(slideInFromLeft.visible).toEqual({
        x: 0,
        opacity: 1,
        transition: {
          duration: 0.5,
          ease: 'easeOut'
        }
      })
    })

    it('slideInFromRight has correct states', () => {
      expect(slideInFromRight.hidden).toEqual({
        x: 100,
        opacity: 0
      })
      expect(slideInFromRight.visible).toEqual({
        x: 0,
        opacity: 1,
        transition: {
          duration: 0.5,
          ease: 'easeOut'
        }
      })
    })

    it('slideInFromBottom has correct states', () => {
      expect(slideInFromBottom.hidden).toEqual({
        y: 100,
        opacity: 0
      })
      expect(slideInFromBottom.visible).toEqual({
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.5,
          ease: 'easeOut'
        }
      })
    })
  })

  describe('modalVariants', () => {
    it('has correct hidden state', () => {
      expect(modalVariants.hidden).toEqual({
        opacity: 0,
        scale: 0.8,
        y: 50
      })
    })

    it('has correct visible state', () => {
      expect(modalVariants.visible).toEqual({
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          duration: 0.3,
          ease: 'easeOut'
        }
      })
    })

    it('has correct exit state', () => {
      expect(modalVariants.exit).toEqual({
        opacity: 0,
        scale: 0.8,
        y: 50,
        transition: {
          duration: 0.2,
          ease: 'easeIn'
        }
      })
    })
  })

  describe('backdropVariants', () => {
    it('has correct hidden state', () => {
      expect(backdropVariants.hidden).toEqual({
        opacity: 0
      })
    })

    it('has correct visible state', () => {
      expect(backdropVariants.visible).toEqual({
        opacity: 1,
        transition: {
          duration: 0.3
        }
      })
    })

    it('has correct exit state', () => {
      expect(backdropVariants.exit).toEqual({
        opacity: 0,
        transition: {
          duration: 0.2
        }
      })
    })
  })

  describe('toastVariants', () => {
    it('has correct hidden state', () => {
      expect(toastVariants.hidden).toEqual({
        x: 300,
        opacity: 0
      })
    })

    it('has correct visible state', () => {
      expect(toastVariants.visible).toEqual({
        x: 0,
        opacity: 1,
        transition: {
          duration: 0.3,
          ease: 'easeOut'
        }
      })
    })

    it('has correct exit state', () => {
      expect(toastVariants.exit).toEqual({
        x: 300,
        opacity: 0,
        transition: {
          duration: 0.2,
          ease: 'easeIn'
        }
      })
    })
  })

  describe('buttonVariants', () => {
    it('has correct rest state', () => {
      expect(buttonVariants.rest).toEqual({
        scale: 1
      })
    })

    it('has correct hover state', () => {
      expect(buttonVariants.hover).toEqual({
        scale: 1.05,
        transition: {
          duration: 0.2,
          ease: 'easeOut'
        }
      })
    })

    it('has correct tap state', () => {
      expect(buttonVariants.tap).toEqual({
        scale: 0.95,
        transition: {
          duration: 0.1
        }
      })
    })
  })

  describe('iconVariants', () => {
    it('has correct rest state', () => {
      expect(iconVariants.rest).toEqual({
        rotate: 0
      })
    })

    it('has correct hover state', () => {
      expect(iconVariants.hover).toEqual({
        rotate: 5,
        transition: {
          duration: 0.2
        }
      })
    })

    it('has correct tap state', () => {
      expect(iconVariants.tap).toEqual({
        rotate: -5,
        transition: {
          duration: 0.1
        }
      })
    })
  })

  describe('progressVariants', () => {
    it('has correct hidden state', () => {
      expect(progressVariants.hidden).toEqual({
        width: 0
      })
    })

    it('has correct visible state', () => {
      expect(progressVariants.visible).toEqual({
        width: '100%',
        transition: {
          duration: 0.5,
          ease: 'easeOut'
        }
      })
    })
  })

  describe('fade animations', () => {
    it('fadeIn has correct states', () => {
      expect(fadeIn.hidden).toEqual({
        opacity: 0
      })
      expect(fadeIn.visible).toEqual({
        opacity: 1,
        transition: {
          duration: 0.3,
          ease: 'easeOut'
        }
      })
    })

    it('fadeInUp has correct states', () => {
      expect(fadeInUp.hidden).toEqual({
        opacity: 0,
        y: 20
      })
      expect(fadeInUp.visible).toEqual({
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.3,
          ease: 'easeOut'
        }
      })
    })

    it('fadeInDown has correct states', () => {
      expect(fadeInDown.hidden).toEqual({
        opacity: 0,
        y: -20
      })
      expect(fadeInDown.visible).toEqual({
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.3,
          ease: 'easeOut'
        }
      })
    })
  })

  describe('scaleIn', () => {
    it('has correct hidden state', () => {
      expect(scaleIn.hidden).toEqual({
        scale: 0,
        opacity: 0
      })
    })

    it('has correct visible state', () => {
      expect(scaleIn.visible).toEqual({
        scale: 1,
        opacity: 1,
        transition: {
          duration: 0.3,
          ease: 'easeOut'
        }
      })
    })
  })

  describe('bounceIn', () => {
    it('has correct hidden state', () => {
      expect(bounceIn.hidden).toEqual({
        scale: 0.3,
        opacity: 0
      })
    })

    it('has correct visible state', () => {
      expect(bounceIn.visible).toEqual({
        scale: 1,
        opacity: 1,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 20
        }
      })
    })
  })

  describe('shakeVariants', () => {
    it('has correct shake state', () => {
      expect(shakeVariants.shake).toEqual({
        x: [0, -10, 10, -10, 10, 0],
        transition: {
          duration: 0.5,
          ease: 'easeInOut'
        }
      })
    })
  })

  describe('floatVariants', () => {
    it('has correct float state', () => {
      expect(floatVariants.float).toEqual({
        y: [0, -10, 0],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      })
    })
  })

  describe('glowVariants', () => {
    it('has correct glow state', () => {
      expect(glowVariants.glow).toEqual({
        boxShadow: [
          '0 0 0px rgba(59, 130, 246, 0)',
          '0 0 20px rgba(59, 130, 246, 0.5)',
          '0 0 0px rgba(59, 130, 246, 0)'
        ],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      })
    })
  })
})
