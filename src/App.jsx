import { Routes, Route } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import SmoothScroll from './lib/smooth'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ScrollToTop from './components/layout/ScrollToTop'
import Preloader from './components/ui/Preloader'
import GrainOverlay from './components/ui/GrainOverlay'
import RouteTransition from './components/ui/RouteTransition'
import PixelCursor from './components/ui/PixelCursor'
import ScrollProgress from './components/ui/ScrollProgress'
import BackToTop from './components/ui/BackToTop'
import HomePage from './pages/Home'
import LayananPage from './pages/Layanan'
import LayananDetailPage from './pages/LayananDetail'
import PortofolioPage from './pages/Portofolio'
import TentangPage from './pages/Tentang'
import KontakPage from './pages/Kontak'
import AdminPage from './pages/Admin'
import NotFoundPage from './pages/NotFound'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen">
        <Preloader />
        <GrainOverlay />
        <SmoothScroll />
        <ScrollToTop />
        <ScrollProgress />
        <PixelCursor />
        <Navbar />
        <RouteTransition>
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/layanan" element={<LayananPage />} />
              <Route path="/layanan/:categorySlug" element={<LayananDetailPage />} />
              <Route path="/layanan/:categorySlug/:serviceSlug" element={<LayananDetailPage />} />
              <Route path="/portofolio" element={<PortofolioPage />} />
              <Route path="/tentang" element={<TentangPage />} />
              <Route path="/kontak" element={<KontakPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </RouteTransition>
        <BackToTop />
        <Footer />
      </div>
    </MotionConfig>
  )
}