import React from 'react'
import "./HeroSection.css"
import { useNavigate } from 'react-router-dom'

import heroSection from '../../../Assets/Home/shopping.png'
const HeroSection = () => {
    const navigate = useNavigate();
  return (
    <div className='hero_section_main_div_home_page'>
        <div className="hero_setion_main_inner_div_page">
            <div className="hero_section_inner_div_main_page_left_side_data">
                <div className="love_shopping_heading_hero_section">
                    Love Shopping
                </div>
                <div className="love_shopping_heading_hero_section keep_shopping">
                    Keep Shopping
                </div>
                <div className="hero_section_motive_intro_div">
                    At Supermart, we're dedicated to making your shopping experience delightful and effortless. With our wide range of products and user-friendly interface, finding what you need has never been easier. Begin your shopping journey with us today!
                </div>
                <div className="button_for_hero_section_div_main_page">
                    <button onClick={() => navigate("/products")}>Explore Now!</button>
                </div>
            </div>
            <div className="hero_section_inner_div_main_page_right_side_data">
                <img src={heroSection} alt="Hero Image" />
            </div>
        </div>
    </div>
  )
}

export default HeroSection