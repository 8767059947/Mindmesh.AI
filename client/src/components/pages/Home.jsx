import React from 'react'
import Navbar from '../Navbar'
import Hero from '../Hero'
import AiTools from '../AiTools'
import Testimonial from '../Testimonial'
import Plan from '../Plan'
import Footer from '../Footer' // Ensure you import the Footer component

function Home() {
  return (
    <>
    <Navbar/>
    <Hero/>
    <AiTools/>
    <Testimonial/>
    <Plan/>
    <Footer/>
    </>
  )
}

export default Home