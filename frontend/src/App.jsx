import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Suspense, lazy } from 'react'

import LazyLoader from './components/LazyLoader'
import { AnimatePresence } from 'framer-motion'
import PageTransition from './components/PageTransition'

import Landing from './pages/Landing'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const CodeOfConduct = lazy(() => import('./pages/CodeOfConduct'))
const HelpCenter = lazy(() => import('./pages/HelpCenter'))
const LearnMore = lazy(() => import('./pages/LearnMore'))
const Blogs = lazy(() => import('./pages/blogs/Blogs'))
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'))
const DashboardLayout = lazy(() => import("./pages/dashboards/DashboardLayout"))
const ComposeBlog = lazy(() => import('./pages/blogs/ComposeBlog'))
const MyBlogs = lazy(() => import('./pages/blogs/MyBlogs'))
const UpdateBlog = lazy(() => import('./pages/blogs/UpdateBlog'))
const AuthWrapper = lazy(() => import('./pages/AuthWrapper'))
const MainBlogViewer = lazy(() => import('./components/blogs/MainBlogViewer'))

const DashboardHome = lazy(() => import('./pages/dashboards/panel_components/DashboardHome'))
const SuperviseUsersHome = lazy(() => import('./pages/dashboards/panel_components/SuperviseUsersHome'))
const LogsHome = lazy(() => import('./pages/dashboards/panel_components/LogsHome'))

// test imports
import PayPage from './material/PayPage'

function App() {
  const location = useLocation();

  return (
    <Suspense fallback={<LazyLoader />}>
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
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          } >
            <Route index element={<DashboardHome />} />
            <Route path='supervise-users' element={<SuperviseUsersHome />} />
            <Route path='logs' element={<LogsHome />} />
          </Route>

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
    </Suspense>


  )
}

export default App