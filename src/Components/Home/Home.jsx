import React from 'react'

import AboutHome from './AboutHome/AboutHome'
import WhyChoose from './WhyChoose/WhyChoose'
import Feature from './Feature/Feature'
import SectionSlider from './SectionSlider/SectionSlider'



function Home() {
  return (
    <>
        <SectionSlider/>
        <AboutHome/>
        <Feature/>
        <WhyChoose/>
     
    </>
  )
}

export default Home