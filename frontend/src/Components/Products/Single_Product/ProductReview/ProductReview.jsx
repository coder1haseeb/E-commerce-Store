// // ProductReview.js

// import React, { useEffect, useState } from 'react';
// import './ProductReview.css';
// import { FaStar } from 'react-icons/fa';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const ProductReview = ({ productId , reviews , fetchReviews}) => {
//     useEffect(()=>{
//         fetchReviews
//     },[])
//     const user = JSON.parse(localStorage.getItem('User'));

//     const handleReview = (e) => {
//         e.preventDefault();
//         if(reviewRating < 1){
//             toast.error("Rating must be greater or equal to 1.")
//             return
//         }
//         if(!reviewText){
//             toast.error("You must have to write review text to proceed.")
//             return
//         }
//         if(reviewText.length < 3){
//             toast.error("Review text must contain atleast 3 characters.")
//             return
//         }
//         const data = {
//             review: {
//                 user_id: user ? user.id : '',
//                 product_id: productId,
//                 review_text: reviewText,
//                 rating: reviewRating,
//             },
//         };
//         console.log(data);
//         axios
//             .post(`${process.env.REACT_APP_API_URL}/reviews`, data)
//             .then((response) => {
//                 toast.success(response.data.message);
//                 fetchReviews()
//                 setReviewRating(0)
//                 setReviewText("")
//             })
//             .catch((error) => {
//                 toast.error('Error in submitting your review. Please try again later.');
//             });
//     };

//     const ratingValue = [1, 2, 3, 4, 5];

//     return (
//         <div className="create_product_review_div_for_the_single_product">
//             <h3>Write a review for this product</h3>
//             <br />
//             <div>
//                 Rating : 
//                 {ratingValue.map((ratingDigit) => (
//                     <FaStar
//                         key={ratingDigit}
//                         onClick={() => setReviewRating(ratingDigit)}
//                         className={reviewRating >= ratingDigit ? 'star-selected' : 'star'}
//                     />
//                 ))}
//             </div>
//             <textarea cols="30" rows="10" value={reviewText} style={{resize : "none"}} onChange={(e) => setReviewText(e.target.value)}></textarea>
//             <button className="btn btn-primary" onClick={handleReview}>
//                 Create Review
//             </button>

//             <div className="review-list">
//                 {reviews.map((review, index) => (
//                     <div key={index} className="review-item">
//                         <div className="rating">
                            
//                             <span style={{
//                                 color : "rgba(0,0,0,.6)",
//                                 marginRight : "1rem"
//                             }}>Rating : {review.rating}</span>
//                             {[...Array(review.rating)].map((_, i) => (
//                                 <FaStar key={i} className="star" />
//                             ))}
//                         </div>
//                         <h4>{review.user}</h4>
//                         <p>{review.review_text}</p>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default ProductReview;
