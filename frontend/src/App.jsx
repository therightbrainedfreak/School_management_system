import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom'
import Landing from './pages/Landing'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CodeOfConduct from './pages/CodeOfConduct'
import HelpCenter from './pages/HelpCenter'
import LearnMore from './pages/LearnMore'
import Blogs from './pages/blogs/Blogs'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import { AnimatePresence } from 'framer-motion'
import PageTransition from './components/PageTransition'
import ComposeBlog from './pages/blogs/ComposeBlog'
import MyBlogs from './pages/blogs/MyBlogs'
import UpdateBlog from './pages/blogs/UpdateBlog'
import AuthWrapper from './pages/AuthWrapper'
import MainBlogViewer from './components/blogs/MainBlogViewer'

// test imports
import PayPage from './material/PayPage'

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

        <Route path='/blogs/view' element={
          <PageTransition>
            <Navbar />
            <MainBlogViewer />
            <Footer />
          </PageTransition>
        } />

        <Route path="/auth" element={
          <PageTransition>
            <AuthWrapper />
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

        <Route path="/blogs/mine" element={
          <PageTransition>
            <ProtectedRoute>
              <Navbar />
              <MyBlogs />
              <Footer />
            </ProtectedRoute>
          </PageTransition>
        } />

        <Route path="/blogs/:blogId" element={
          <PageTransition>
            <ProtectedRoute>
              <Navbar />
              <UpdateBlog />
              <Footer />
            </ProtectedRoute>
          </PageTransition>
        } />

        <Route path='/pg/pay' element={
          <PayPage />
        } />

      </Routes>
    </AnimatePresence>
  )
}

export default App