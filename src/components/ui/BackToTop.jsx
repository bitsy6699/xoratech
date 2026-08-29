import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { scrollToTop } from '../../lib/smooth'
import PixelArrow from './PixelArrow'

export default function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          onClick={() => void scrollToTop()}
          aria-label="Kembali ke atas"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-6 right-6 z-40 inline-flex h-12 w-12 items-center justify-center border-2 border-primary/25 bg-primary text-cream shadow-[2px_2px_0_0_#093FB4] transition-colors hover:brightness-110"
        >
          <PixelArrow direction="u" className="h-4 w-4 text-cream" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}