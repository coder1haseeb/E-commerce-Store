import React, { useEffect, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import JoditEditor from 'jodit-react';
import { useNavigate } from 'react-router-dom';
import './Single_product.css';
import { FaStar } from 'react-icons/fa';
import './ProductReview/ProductReview.css'
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

import { BsCheckAll } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import SingleProductCheckOut from './SingleProductCheckout/SingleProductCheckOut';
import ProductReview from './ProductReview/ProductReview';

const Single_product = () => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [content, setContent] = useState('');
    const [price, setPrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const { slug } = useParams();
    const [product, setProduct] = useState({});
    const [getCart , setGetCart] = useState({})
    const [images, setImages] = useState([]);
    const [enteredQuantity, setEnteredQuantity] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const imagesRef = useRef();
    const [isFetched , setIsFetched] = useState(false)
    const [value , setValue] =useState(0)
    const labels = {
        0.5: 'Useless',
        1: 'Useless+',
        1.5: 'Poor',
        2: 'Poor+',
        2.5: 'Ok',
        3: 'Ok+',
        3.5: 'Good',
        4: 'Good+',
        4.5: 'Excellent',
        5: 'Excellent+',
    };

    const user = JSON.parse(localStorage.getItem("User"));
    const token = localStorage.getItem("Token");

    const handleReview = (e) => {
        e.preventDefault();
        if(product.isEligible == null){
            toast.error("Please buy the product first to create a review.")
            return
        }
        if(product.isEligible.is_shipped == false){
            toast.error("Please wait untill product is shipped to you. Once receive product then give us feedback.")
            return
        }
        if(reviewRating < 1){
            toast.error("Rating must be greater or equal to 1.")
            return
        }
        if(!reviewText){
            toast.error("You must have to write review text to proceed.")
            return
        }
        if(reviewText.length < 3){
            toast.error("Review text must contain atleast 3 characters.")
            return
        }
        const data = {
            review: {
                user_id: user ? user.id : '',
                product_id: product.id,
                review_text: reviewText,
                rating: reviewRating,
            },
        };
        console.log(data);
        axios
            .post(`${process.env.REACT_APP_API_URL}/reviews`, data)
            .then((response) => {
                toast.success(response.data.message);
                fetchReviews()
                setReviewRating(0)
                setReviewText("")
            })
            .catch((error) => {
                toast.error('Error in submitting your review. Please try again later.');
            });
    };

    
    const removeImage = (indexToRemove) => {
        const filteredImages = images.filter((_, index) => index !== indexToRemove);
        setImages(filteredImages);
    };

    const handleImageChange = (e) => {
        const files = e.target.files;
        const imagesArray = Array.from(files);
        setImages(imagesArray);
    };


    const navigate = useNavigate();
    const data = {
        product: {
            name: name,
            description: content,
            quantity: quantity,
            stock: quantity > 0,
            price: price,
            discount: discount
        },
    };
    const fetchReviews = () => {
        axios
        .get(`${process.env.REACT_APP_API_URL}/reviews`, { params: { review: { product_id: product.id } } })
        .then((res) => {
            setReviews(res.data);
            console.log(res);
            setIsFetched(false)
        })
        .catch((err) => {
            console.error(err);
        });
    };

    const fetchProductData = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/product/${slug}`, {
            headers: {
                "Authorization": token
            }
        }).then(res => {
            setProduct(res?.data?.product);
            setIsFetched(true)
            setGetCart(res?.data?.cart);
            setValue(res?.data?.product.ratings / 5);
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
    };
    if(isFetched){
        fetchReviews()
    }
    useEffect(() => {
        fetchProductData();
    }, [slug]);        
    const parseHTML = (description) => {
        return { __html: description };
    };
    
    const handleContentChange = (newContent) => {
        setContent(newContent);
    };
    
    const handleCartClick = (e) => {
        e.preventDefault();
        if (!user){
            toast.info("Please Login first to Create Cart.")
            return
        }
        if (enteredQuantity <= 0) {
            toast.error("Must contain value greater then 1.");
            return;
        } else if (enteredQuantity > product.quantity) {
            toast.error("Enter the product quantity in the range of avalibale product quantity.");
            return;
        }
        const cartData = {
            "cart": {
                user_id: user.id,
                product_id: product.id,
                items_quantity: parseInt(enteredQuantity)
            }
        };
        axios.post(`${process.env.REACT_APP_API_URL}/carts`, cartData, {
            headers: {
                'Authorization': token
            }
        }).then(res => {
            console.log(res);
            toast.success("Item added to Cart Successfully.");
            fetchProductData()
        }).catch(err => {
            console.log(err);
            toast.error(err.message);
        });
    };
    
    const handleCartUpdate = (e) => {
        if (!user){
            toast.info("Please Login first to Create Cart.")
            return
        }
        e.preventDefault();
        if (enteredQuantity <= 0) {
            toast.error("Must contain value greater then 1.");
            return;
        } else if (enteredQuantity > product.quantity) {
            toast.error("Enter the product quantity in the range of avalibale product quantity.");
            return;
        }
        const cartData = {
            "cart": {
                items_quantity: parseInt(enteredQuantity)
            }
        };
        axios.put(`${process.env.REACT_APP_API_URL}/carts/${getCart.id}`, cartData, {
            headers: {
                'Authorization': token
            }
        }).then(res => {
            console.log(res);
            toast.success("Cart updated Successfully.");
            fetchProductData()
        }).catch(err => {
            console.log(err);
            toast.error(err.message);
        });
    };
    console.log(product.ratings);
    const discounted_price = product.price - (product.price * (product.discount / 100));
    const ratingValue = [1,2,3,4,5]
    return (
        <div>
            {product ?
                <div className='single_product_div_with_slug_div_main_page'>
                    <div className="display_image_div_for_the_product_with_out_update">
                        <div className="left_side_product_images_display_div">
                            <Swiper pagination={true} modules={[Pagination]} className="mySwiper">
                                {product?.images?.map((image, index) => {
                                    return (
                                        <div className='single_div_for_the_image_div_single_image' key={index}>
                                            <SwiperSlide>
                                                <img src={image.url} alt="Product Image" />
                                            </SwiperSlide>
                                        </div>
                                    );
                                })}
                            </Swiper>
                        </div>
                        <div className="right_side_product_data_and_info_diaply_div">
                            <div className="product_name_div_for_single_product_page_right_side">
                                <h1>{product.name}</h1>
                            </div>
                            <Box
                                sx={{
                                    width: 200,
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <Rating
                                    name="text-feedback"
                                    value={product.ratings}
                                    readOnly
                                    precision={0.5}
                                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                />
                                <Box sx={{ ml: 2 }}>{labels[product.ratings]}</Box>
                            </Box>
                            <div className="price_for_single_product_div_right_side">
                                <div className='price_for_single_product_div single_page_price_div_single_page_div'>Price : <span style={{ fontWeight: product.discount > 0 ? "normal" : "bold", textDecoration: product.discount > 0 && "line-through", color: product.discount > 0 && "red" }}>{product.price}</span> {product.discount > 0 && <span>{discounted_price}</span>} -/ RS</div>
                                {product.discount > 0 &&
                                    <div className='discount_price_and_percentage_div' style={{ marginLeft: "2rem" }}>
                                        <div className='discount_for_single_product_div btn btn-success'>{product.discount} % OFF</div>
                                    </div>
                                }
                            </div>
                            <div className='stock_div_for_single_product_div' style={{ fontSize: "1.3rem" }}>
                                <strong style={{ marginRight: "1rem" }}>Availability</strong>
                                {product.quantity > 0 ?
                                    <>
                                        <span style={{ color: "green", fontWeight: "600" }}>In Stock <BsCheckAll style={{ fontSize: "1.3rem" }} /></span>
                                        <div className='single_product_page_quantity_number'>
                                            {product.quantity} Pieces Available
                                        </div>
                                    </>
                                    :
                                    <span style={{ color: "red", fontWeight: "600" }}>Out of Stock <FaTimes /> </span>
                                }
                            </div>
                            <div className='add_to_cart_single_product_page_cart_form_margin'>
                                {getCart && 
                                    <div className="a"><strong>Current Cart Items : {getCart.items_quantity}</strong></div>
                                }
                                <form className='add_to_cart_input_and_btn_div_single_product'>
                                    <div className='form-floating mb-3 add_to_cart_input_div_for_single_product'>
                                        <input
                                            type='number'
                                            value={enteredQuantity}
                                            min={1}
                                            required
                                            onChange={(e) => setEnteredQuantity(e.target.value)}
                                            className='form-control'
                                            id='floatingInput'
                                            placeholder='Enter quantity'
                                        />
                                        <label htmlFor='floatingInput'>{getCart ? `Current Cart ${getCart.items_quantity}` :"Product Quantity"} <span style={{ color: "red" }}>*</span></label>
                                    </div>
                                    {
                                        getCart ?
                                        <button className='btn btn-primary add_to_cart_btn_for_single_product_div' onClick={handleCartUpdate}>
                                            Update Cart
                                        </button>
                                        :
                                        <button className='btn btn-primary add_to_cart_btn_for_single_product_div' onClick={handleCartClick}>
                                            Add to cart
                                        </button>
                                    } 
                                    <div>
                                        <button type="button" className='btn btn-warning add_to_cart_btn_for_single_product_div' data-bs-toggle="modal" data-bs-target={`#exampleModal_${product.id}`}>
                                            Buy Now
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div dangerouslySetInnerHTML={parseHTML(product.description)} className='description_for_the_single_product_' />
                    <div className="description_for_the_single_product_">
                        <div className="create_product_review_div_for_the_single_product">
                            <h3>Write a review for this product</h3>
                            <br />
                            <div>
                                Rating : 
                                {ratingValue.map((ratingDigit) => (
                                    <FaStar
                                        key={ratingDigit}
                                        onClick={() => setReviewRating(ratingDigit)}
                                        className={reviewRating >= ratingDigit ? 'star-selected' : 'star'}
                                    />
                                ))}
                            </div>
                            <textarea cols="30" rows="10" value={reviewText} style={{resize : "none"}} onChange={(e) => setReviewText(e.target.value)}></textarea>
                            <button className="btn btn-primary" onClick={handleReview}>
                                Create Review
                            </button>

                            <div className="review-list">
                                {reviews.map((review, index) => (
                                    <div key={index} className="review-item">
                                        <div className="rating">
                                            
                                            <span style={{
                                                color : "rgba(0,0,0,.6)",
                                                marginRight : "1rem"
                                            }}>Rating : {review.rating}</span>
                                            {[...Array(review.rating)].map((_, i) => (
                                                <FaStar key={i} className="star" />
                                            ))}
                                        </div>
                                        <h4>{review.user}</h4>
                                        <p>{review.review_text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div className="loader"></div>
            }
            {product && (
                <div className="modal fade" id={`exampleModal_${product.id}`} style={{height : "100%"}} tabIndex="-1" aria-labelledby={`exampleModalLabel_${product.id}`} aria-hidden="true" >
                    <div className="modal-dialog modal-dialog-centered custom-modal-width">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id={`exampleModalLabel_${product.id}`}>Buy Now !</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <SingleProductCheckOut product={product} cart={getCart} discounted_price={discounted_price} fetchProduct={fetchProductData}/>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Single_product;
