import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import 'dotenv/config'
import './Products.css'

import image from '../../Assets/Home/shopping.png'

import { BsCheckAll } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import EmailForm from './EmailForm'

const Products = () => {

  const [products , setProducts ] = useState([])
  const navigate = useNavigate();
  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_API_URL}/products` , {
      headers : {
        "Authorization" : localStorage.getItem("Token")
      }
    }).then((res)=>{
      setProducts(res.data)
      console.log(res.data);
    }).catch((err)=>{
      console.log(err);
    })
  },[])
  return (
    <div className='all_products_main_page_div'>
      <div className='heading_for_upload_div_product_div'>All Product</div>
      {
        products.length > 0 ?
        <div className="all_products_div_mapping_div_products_main_page">
          {
            products?.map(product =>{
              const discounted_price = product.price - (product.price * (product.discount / 100))
              return(
                <div className='single_div_for_product_after_mapping' key={product.id}>
                  <div className="top_image_div_for_single_product_div">
                    <img src={product.images[0]?.url} alt="" />
                  </div>
                  <div className='name_for_single_product_div'>{product.name}</div>
                  <div className="price_and_discount_div_for_the_single_product">
                    <div className='price_for_single_product_div'>Price : <span style={{ fontWeight: product.discount > 0 ? "normal" : "bold" , textDecoration : product.discount > 0 && "line-through" , color : product.discount > 0 && "red"}}>{product.price}</span> {product.discount > 0 && <span>{discounted_price}</span>} -/ RS</div>
                    {product.discount > 0 &&
                      <div className='discount_price_and_percentage_div'>
                        <div className='discount_for_single_product_div btn btn-success'>{product.discount} % OFF</div>
                      </div>
                    }
                  </div>
                  <div className='stock_div_for_single_product_div'><strong style={{marginRight : "1rem"}}>Availability</strong>{product.quantity > 0 ? <span style={{color : "green" , fontWeight : "600"}}>In Stock <BsCheckAll style={{fontSize : "1.3rem"}}/></span> : <span style={{color : "red" , fontWeight : "600"}}>Out of Stock <FaTimes /> </span>}</div>
                  <button className='btn btn-primary' onClick={() => navigate(`/products/${product.slug}`)}>Explore</button>
                </div>
              )
            })
          }
        </div>
        :
        <div className='no_items_right_now_cart_page_div'>No Products Yet!</div>
      }
    </div>
  )
}

export default Products