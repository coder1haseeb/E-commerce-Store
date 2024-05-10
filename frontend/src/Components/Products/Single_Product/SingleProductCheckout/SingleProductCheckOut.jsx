import React, { useState } from 'react';
import './SingleProductCheckout.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const SingleProductCheckOut = ({ product, cart , discounted_price ,fetchProduct}) => {

  const [cardNum , setCardNum] = useState()
  const [expDate, setExpDate] = useState()
  const [cvv , setCVV] = useState()
  const [enteredItems , setEnteredItems] = useState(0)
  const [address , setAddress] = useState("")
  const [phoneNumber , setPhoneNumber] = useState()
  const [email , setEmail ]=useState('')

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const user = JSON.parse(localStorage.getItem("User"))
  const token = localStorage.getItem("Token") 

  const updateProduct = () => {
    axios.put(`${process.env.REACT_APP_API_URL}/admin/product_quantity_update/${product.id}}` , { quantity : product.quantity - enteredItems }).then(res => {
      fetchProduct();
    }).catch(err => {
      console.log(err);
    })
  }

  const handlePayClick = () =>{
    if (!user){
      toast.info("Please Login first to buy.")
      return
    }
    if(product.quantity <= 0 ){
      toast.error("Product is Out of Stock now. Please wait untill new stock arrives.")
      return
    }
    if(enteredItems > product.quantity){
      toast.error("Please enter quantity between 1 to "+ product.quantity)
      return
    }
    if(enteredItems <= 0){
        toast.error("Items must be greater than 0.")
        return
    }
    if(!cardNum || !expDate || !cvv || !phoneNumber || !address || !email){
        toast.error("Please fill out all fields.");
        return;
    }
    if(!emailPattern.test(email)){
      toast.error("Enter proper Email Address.")
      return
    }
    const data = {
        "order" : {
            "product_id" :  product.id,
            "user_id" : user.id,
            "ordered_quantity" : enteredItems,
            "payed_amount" : enteredItems * discounted_price,
            "is_shipped" : false,
            "email" : email,
            "phone_number" : phoneNumber,
            "address" : address
        }
    }   
    axios.post(`${process.env.REACT_APP_API_URL}/orders/` , data , {
        headers : {
            "Authorization" : token
        }
    }).then(res => {
        toast.success(res.data.message);
        updateProduct()
        setAddress("")
        setCVV(null)
        setCardNum(null)
        setEmail("")
        setPhoneNumber(null)
        setEnteredItems(null)
        setExpDate(null)
    }).catch(err =>console.error('Error', err))
}

  return (
    <div className='single_producct_check_out_page_for_e_commerce'>
      <div className="left_side_product_detail_div_check_out_page">

        <div className="image_div_for_single_div_of_check_out_for_page">
          {product?.images && product.images.length > 0 && (
            <img src={product.images[0].url} alt="product" />
          )}
        </div>
        <div className="lower_info_for_single_product_checkout">
          <div className="name_of_product_for_single_product_checkout">
            <h4>{product.name}</h4>
          </div>
          <div className="price_div_for_single_product_check_out_after_discount">
            <div className='price_for_single_product_div single_page_price_div_single_page_div' style={{fontSize : "1.3rem"}}>Price : <span style={{ fontWeight: product.discount > 0 ? "normal" : "bold", textDecoration: product.discount > 0 && "line-through", color: product.discount > 0 && "red" }}>{product.price}</span> {product.discount > 0 && <span>{discounted_price}</span>} -/ RS</div>
          </div>  
          <div className="items_count_input_div_single_checkout">
            <div className="btn btn-danger decrease_btn_for_the_product_check_out" onClick={() => {setEnteredItems(prevItems => prevItems - 1)}}>-</div>
            <div className='form-floating mb-3' style={{margin : "0 .5rem" , marginTop : "1rem"}}>
              <input
                type='number'
                value={enteredItems}
                min={1}
                required
                onChange={(e) => setEnteredItems(parseInt(e.target.value))}
                className='form-control'
                id='floatingInput'
                placeholder='name@example.com'
              />
              <label htmlFor='floatingInput'>Enter Quantity <span style={{color : "red"}}>*</span></label>
            </div>
            <div className="btn btn-primary increase_btn_for_the_product_check_out" onClick={() => {setEnteredItems(prevItems => prevItems + 1)}}>+</div>
          </div>
        </div>
      </div>
      <div className="right_side_product_checkout_div_card_payment_div_info">
        <div className="total_amount_to_pay_right_side_single_checkout">
          Total Amount To Pay: {enteredItems * discounted_price} RS
        </div>
        <div className='form-floating mb-3'>
          <input
            type='number'
            value={cardNum}
            required
            min={0}
            onChange={(e) => setCardNum(e.target.value)}
            className='form-control'
            id='floatingInput'
            placeholder='name@example.com'
          />
          <label htmlFor='floatingInput'>Card Number <span style={{color : "red"}}>*</span></label>
        </div>
        <div className="card_date_and_cvv_div_for_the_order">
          <div className='form-floating mb-3'>
            <input
              type='date'
              value={expDate}
              required
              onChange={(e) => setExpDate(e.target.value)}
              className='form-control'
              id='floatingInput'
              placeholder='name@example.com'
              />
            <label htmlFor='floatingInput'>Expiry Date <span style={{color : "red"}}>*</span></label>
          </div>
          <div className='form-floating mb-3'>
            <input
              type='number'
              min={0}
              value={cvv}
              required
              onChange={(e) => setCVV(e.target.value)}
              className='form-control'
              id='floatingInput'
              placeholder='name@example.com'
              />
            <label htmlFor='floatingInput'>CVV <span style={{color : "red"}}>*</span></label>
          </div>
        </div>
        <div className='form-floating mb-3'>
          <input
            type='number'
            min={0}
            value={phoneNumber}
            required
            onChange={(e) => setPhoneNumber(e.target.value)}
            className='form-control'
            id='floatingInput'
            placeholder='name@example.com'
          />
          <label htmlFor='floatingInput'>Phone Number <span style={{color : "red"}}>*</span></label>
        </div>
        <div className='form-floating mb-3'>
          <input
            type='text'
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className='form-control'
            id='floatingInput'
            placeholder='name@example.com'
          />
          <label htmlFor='floatingInput'>Email <span style={{color : "red"}}>*</span></label>
        </div>
        <div className='form-floating mb-3'>
          <input
            type='text'
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
            className='form-control'
            id='floatingInput'
            placeholder='name@example.com'
          />
          <label htmlFor='floatingInput'>Address <span style={{color : "red"}}>*</span></label>
        </div>
        <div className="check_out_button_div_for_the_client_payment">
          <button className='btn btn-success' style={{width : "100%"}} onClick={handlePayClick}>PAY NOW</button>
        </div>
      </div>
    </div>
  );
};

export default SingleProductCheckOut;
