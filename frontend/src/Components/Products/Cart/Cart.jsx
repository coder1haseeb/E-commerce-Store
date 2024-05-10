import React, { useEffect, useState } from 'react';
import "./Cart.css";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { MdDelete } from "react-icons/md";
import { FiExternalLink } from "react-icons/fi";

const Cart = () => {
    const [carts, setCarts] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]); // State to store selected cart items
    const [bill, setBill] = useState(0);
    const [selecteCart , setSelectedCart] = useState([])
    const [cardNum , setCardNum] = useState()
    const [expDate, setExpDate] = useState()
    const [cvv , setCVV] = useState()
    const [enteredItems , setEnteredItems] = useState(0)
    const [address , setAddress] = useState("")
    const [phoneNumber , setPhoneNumber] = useState()
    const [email , setEmail ]=useState('')
    const navigate = useNavigate();
    const token = localStorage.getItem("Token");
    
    const fetchCarts = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/carts`, {
            headers: {
                "Authorization": token
            }
        }).then(res => {
            console.log(res);
            setCarts(res.data.carts);
        }).catch(err => {
            console.log(err);
        });
    };
    
    const handleCartItemDelete = (cart_id , cart) => {
        const isSelected = selectedItems.some(item => item.id === cart_id);
        if (isSelected) {
            setSelectedItems(prevSelectedItems => prevSelectedItems.filter(item => item.id !== cart.id));
        } else {
            setSelectedItems(prevSelectedItems => [...prevSelectedItems, cart]);
        }

        axios.delete(`${process.env.REACT_APP_API_URL}/carts/${cart_id}`, {
            headers: {
                "Authorization": token
            }
        }).then(res => {
            console.log(res);
            toast.success(res.data.message);
            fetchCarts();
        }).catch(err => {
            console.log(err);
        });
    };

    useEffect(() => {
        fetchCarts();
    }, []);

    // useEffect(() => {
    //     let totalAmount = 0;
    //     carts.forEach(cart => {
    //         const discounted_price = cart.product.price - (cart.product.price * (cart.product.discount / 100));
    //         totalAmount += cart.items_quantity * discounted_price;
    //     });
    //     setBill(totalAmount);
    // }, [carts]);
    
    const user = JSON.parse(localStorage.getItem("User"))
    
    const handleCartCheck = () => { 
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!cardNum || !expDate || !cvv || !phoneNumber || !address || !email){
            toast.error("Please fill out all fields.");
            return;
        }
        if(!emailPattern.test(email)){
          toast.error("Enter proper Email Address.")
          return
        }
        selectedItems.forEach(cart => {
            if(cart.items_quantity > cart.product.quantity){
                toast.error("Your Current Items quantity is not available in Stock. Please try to update cart or wait till stock increases")
                return
            }
            const discounted_price = cart.product.price - (cart.product.price * (cart.product.discount / 100));
            const data = {
                "order" : {
                    "product_id" :  cart.product.id,
                    "user_id" : user.id,
                    "ordered_quantity" : cart.items_quantity,
                    "payed_amount" : cart.items_quantity * discounted_price,
                    "is_shipped" : false,
                    "email" : email,
                    "phone_number" : phoneNumber,
                    "address" : address
                }
            };
            axios.post(`${process.env.REACT_APP_API_URL}/orders/` , data , {
                headers : {
                    "Authorization" : token
                }
            }).then(res => {
                console.log(res);
                toast.success("Order Placed Successfully.");
                const updatedQuantity = cart.product.quantity - cart.items_quantity;
                console.log(updatedQuantity);
                axios.put(`${process.env.REACT_APP_API_URL}/admin/product_quantity_update/${cart.product.id}` , { quantity : updatedQuantity })
                    .then(res => {
                        console.log(res.data);
                        axios.delete(`${process.env.REACT_APP_API_URL}/carts/${cart.id}`, {
                            headers: {
                                "Authorization": token
                            }
                        }).then(res => {
                            fetchCarts();
                        }).catch(err => {
                            console.log(err);
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    });
    
            }).catch(err => {
                console.log(err);
            });
        });

    };
    
    
    const handleCartSelect = (cart) => {
        const isSelected = selectedItems.some(item => item.id === cart.id);
        if (isSelected) {
            setSelectedItems(prevSelectedItems => prevSelectedItems.filter(item => item.id !== cart.id));
        } else {
            setSelectedItems(prevSelectedItems => [...prevSelectedItems, cart]);
        }
    }    
    useEffect(() => {
        let totalAmount = 0;
        selectedItems.forEach(cart => {
            const discounted_price = cart.product.price - (cart.product.price * (cart.product.discount / 100));
            totalAmount += cart.items_quantity * discounted_price;
        });
        setBill(totalAmount);
        console.log(selectedItems);
    }, [selectedItems]);
    

    return (
        <div className='cart_div_main_page_all_products_and_checkout_btn'>
            <div className='heading_for_upload_div_product_div'>Cart</div>
            {carts?.length > 0 ? (
                <div className="bottom_div_for_the_cart_and_fetch_button">
                    <div className="all_product_show_for_cart_on_left_side">
                        {carts?.map((cart) => { 
                            const discounted_price = cart.product.price - (cart.product.price * (cart.product.discount / 100));
                            return(
                                <div className='single_cart_item_div_for_carts_show_div' key={cart.id}>
                                    <div className="check_box_for_single_cart_item_mark_for_check_out">
                                        {/* <input type="checkbox" name="" style={{height : "1.5rem" , margin : "0 .5rem", width : "1.5rem"}} id="" /> */}
                                        <div class="form-check form-switch" data-bs-theme="secondary">
                                            <input 
                                                class="form-check-input" 
                                                type="checkbox" 
                                                role="switch" 
                                                id="flexSwitchCheckDefault" 
                                                onClick={() => handleCartSelect(cart)}
                                            />
                                        </div>
                                    </div>
                                    <div className="left_side_inner_cart_div_image_display">
                                        <img src={cart.product.images[0].url} alt="Product Image" />
                                    </div>
                                    <div className="right_side_inner_cart_div_info_display">
                                        <h4 className='product_name_for_single_cart_div'>{cart.product.name}</h4>
                                        <div className="quantity_and_price_combine_div_for_the_singel_cart">
                                            <div className="quantity_div_for_single_cart">
                                                <strong>Quantity</strong> : {cart.items_quantity}
                                            </div>
                                            <div className="product_price_by_quantity_div">
                                                <strong>Discount</strong> : {cart.product.discount} %
                                            </div>
                                            <div className="product_price_by_quantity_div">
                                                <strong>Price</strong> : {discounted_price}
                                            </div>
                                            <div className="product_price_by_quantity_div text-success">
                                                <strong>Total</strong> : {discounted_price * cart.items_quantity}
                                            </div>
                                        </div>
                                        <div className="lower_action_all_buttons_for_single_cart">
                                            <div className="remove_btn_for_the_single_item_cart_div text-danger" style={{marginLeft : ".5rem", cursor : "pointer", fontSize : "1.7rem"}} onClick={() => handleCartItemDelete(cart.id , cart)}><MdDelete /></div>
                                            <div className="remove_btn_for_the_single_item_cart_div text-success" style={{marginLeft : ".5rem" , cursor : "pointer" , fontSize : "1.5rem"}} onClick={() => navigate(`/products/${cart.product.slug}`)}><FiExternalLink /></div>
                                        </div>
                                    </div>
                                </div>
                            ) 
                        })}
                    </div>
                    <div className="check_out_div_for_cart_page_div">
                        <div className="check_out_heading_for_cart_page">
                            Check out
                        </div>
                        <div className="total_items_div_for_cart_page_check_out">
                            <strong>Total Items : </strong> <span className='dynamic_entity_div_for_the_total_items'>{selectedItems?.length}</span>
                        </div>
                        {
                            selectedItems.length > 0 ?
                            <>
                                <div className="total_items_div_for_cart_page_check_out">
                                    <strong>Shipping Tax : </strong> <span className='dynamic_entity_div_for_the_total_items'>200 PKR</span>
                                </div>
                                <div className="total_items_div_for_cart_page_check_out">
                                    <strong>Total Amount : </strong> <span className='dynamic_entity_div_for_the_total_items'>{bill + 200} PKR</span>
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
                                    <div className="button_for_check_out_div">
                                        <button className='btn btn-dark' onClick={handleCartCheck}>CHECK OUT</button>
                                    </div>
                            </>
                            :
                            <div style={{textAlign : "center" , margin : "2rem 0"}}><h4>Please Select Items to Checkout.</h4></div>
                        }                                                              
                    </div>
                </div>
            ) : (
                <div className='no_items_right_now_cart_page_div'>
                    No items Right now. <button className='btn btn-primary' onClick={() => navigate('/products')}>Explore</button>
                </div>
            )}
        </div>
    );
};

export default Cart;
