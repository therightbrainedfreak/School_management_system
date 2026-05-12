import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom'
import Landing from './pages/Landing'
import LoginPage from './pages/Login'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CodeOfConduct from './pages/CodeOfConduct'
import HelpCenter from './pages/HelpCenter'
import LearnMore from './pages/LearnMore'
import Blogs from './pages/Blogs'
import BlogsNavbar from './components/BlogsNavbar'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import { AnimatePresence } from 'framer-motion'
import PageTransition from './components/PageTransition'
import ComposeBlog from './pages/ComposeBlog'

function App() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>

        <Route path='/' element={
          <PageTransition>
            <Navbar />
            <Landing />
            <Footer />
          </PageTransition>
        } />

        <Route path="/login" element={
          <PageTransition>
            <Navbar />
            <LoginPage />
            <Footer />
          </PageTransition>
        } />

        <Route path="/code-of-conduct" element={
          <PageTransition>
            <Navbar />
            <CodeOfConduct />
            <Footer />
          </PageTransition>
        } />

        <Route path="/help-center" element={
          <PageTransition>
            <Navbar />
            <HelpCenter />
            <Footer />
          </PageTransition>
        } />

        <Route path="/learn-more" element={
          <PageTransition>
            <Navbar />
            <LearnMore />
            <Footer />
          </PageTransition>
        } />

        <Route path="/blogs" element={
          <PageTransition>
            <Navbar />
            <BlogsNavbar />
            <Blogs />
            <Footer />
          </PageTransition>
        } />

        <Route path="/dashboard" element={
          <PageTransition>
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          </PageTransition>
        } />

        <Route path="/blogs/compose" element={
          <PageTransition>
            <ProtectedRoute>
              <Navbar />
              <ComposeBlog />
              <Footer />
            </ProtectedRoute>
          </PageTransition>
        } />

      </Routes>
    </AnimatePresence>
  )
}

export default App