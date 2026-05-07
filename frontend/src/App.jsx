import './App.css'
import { Routes, Route } from 'react-router-dom'
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

function App() {
  return (

    <Routes>

      <Route path='/' element={
        <>
          <Navbar />
          <Landing />
          <Footer/>
        </>
      } />

      <Route path="/login" element={
        <>
        <Navbar/>
        <LoginPage/>
        <Footer/>
        </>
      }/>

      <Route path="/code-of-conduct" element={
        <>
        <Navbar/>
        <CodeOfConduct/>
        <Footer/>
        </>
      }/>

      <Route path="/help-center" element={
        <>
        <Navbar/>
        <HelpCenter/>
        <Footer/>
        </>
      }/>

      <Route path="/learn-more" element={
        <>
        <Navbar/>
        <LearnMore/>
        <Footer/>
        </>
      }/>
      
      <Route path="/blogs" element={
        <>
        <Navbar/>
        <BlogsNavbar/>
        <Blogs/>
        <Footer/>
        </>
      }/>

      <Route path="/dashboard" element={
        <>
        <ProtectedRoute>
          <dashboard/>
        </ProtectedRoute>
        </>
      }/>
    </Routes>
  )
}

export default App