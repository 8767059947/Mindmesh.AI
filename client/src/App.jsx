
import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './components/pages/Home'
import Layout from './components/pages/Layout'
import Dashboard from './components/Dashboard'
import WriteArticle from './components/pages/WriteArticle'
import BlogTitles from './components/pages/BlogTitles'
import GenerateImages from './components/pages/GenerateImages'
import RemoveBackground from './components/pages/RemoveBackground'
import RemoveObject from './components/pages/RemoveObject'
import ReviewResume from './components/pages/ReviewResume'
import Community from './components/pages/Community'
import { useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react'
import {Toaster} from 'react-hot-toast'


function App() {
  

  return (
   <div>
    <Toaster/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/ai' element={<Layout/>}>
        <Route index element={<Dashboard/>}/>
         <Route path='write-article' element={<WriteArticle/>}/>
         <Route path='blog-titles' element={<BlogTitles/>}/>
          <Route path='generate-images' element={<GenerateImages/>}/>
            <Route path='remove-background' element={<RemoveBackground/>}/>
           <Route path='remove-object' element={<RemoveObject/>}/>
            <Route path='review-resume' element={<ReviewResume/>}/>
              <Route path='community' element={<Community/>}/>
        </Route>
      </Routes>
   </div>
  )
}

export default App
