import axios from 'axios'
import React, { useEffect, useState } from 'react'
import '../CheckOrders/CheckOrders.css'
import './ViewSales.css'
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { MdVerified } from "react-icons/md";

const ViewSales = () => {
  const user = JSON.parse(localStorage.getItem("User"))
  const [sales, setSales] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const fetchSales = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/admin/sales`).then(res => {
      setSales(res.data);
      let total = 0;
      res.data?.forEach(item => {
        total += parseFloat(item.sale.payed_amount); // Access payed_amount within the sale object
      });
      setTotalAmount(total.toFixed(2));
      console.log(res.data);
    }).catch(err => {
      console.log(err);
    });
  };

  useEffect(() => {
    fetchSales()
  },[])
    return (
      <div className='all_orders_div_admin_page_div_main'>
        <div className='heading_for_upload_div_product_div'>Sold Products</div>
        <div className="accordion" style={{margin : "1rem 0"}} id="accordionExample">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button" style={{fontSize : "1.4rem" , fontWeight : "bold"}} type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                View Analytics
              </button>
            </h2>
            <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                <div className="accordation_body_div_for_sold_products_analytics">
                  <div className="total_sales_div_for_the_analytics_of_sold">
                    <div className="heading_for_total_sales_alayics_div">
                      Total Sales
                    </div>
                    <div className="dynamic_entity_for_the_sales_count_div">
                      {sales.length}
                    </div>
                  </div>
                  <div className="total_sales_div_for_the_analytics_of_sold">
                    <div className="heading_for_total_sales_alayics_div">
                      Amount Earned
                    </div>
                    <div className="dynamic_entity_for_the_sales_count_div">
                      {totalAmount} RS
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      { sales?.length > 0 ?
        <div className="all_products_div_mapping_div_products_main_page">
          {sales?.map(singleSale => {
            const discounted_price = singleSale.sale.product.price - (singleSale.sale.product.price * (singleSale.sale.product.discount / 100));
            return (
              <div className="card" id={singleSale.sale.id} style={{ width: "100%" }}>
                <img src={singleSale?.sale?.product?.images[0].url} className="card-img-top" alt="..." />
                <div className="card-body">
                  <h5 className="card-title title_div_for_the_order_name_div">{singleSale?.sale?.product?.name}</h5>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item"><strong>Price : </strong>{discounted_price}</li>
                  <li className="list-group-item"><strong>Quantity : </strong>{singleSale?.sale?.ordered_quantity}</li>
                  <li className="list-group-item"><strong>Amount : </strong>{singleSale?.sale?.payed_amount} RS <span className='text-success' style={{ fontWeight: "bold" }}>PAID <MdVerified /></span></li>
                </ul>
                <div className="card-body">
                  <button type="button" style={{ marginRight: ".7rem" }} className="btn btn-primary" data-bs-toggle="modal" data-bs-target={`#orderModal_${singleSale.sale.id}`}>
                    View
                  </button>

                  <div className="modal fade" id={`orderModal_${singleSale.sale.id}`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h1 className="modal-title fs-5" id="exampleModalLabel">Order</h1>
                          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body outer_div_modal_for_the_single_order">
                          <div className="left_side_order_div_for_the_images_for_product_modal">
                            <Swiper pagination={true} modules={[Pagination]} className="mySwiper">
                              {singleSale?.sale?.product?.images?.map((image, index) => {
                                return (
                                  <div className='single_div_for_the_image_div_single_image' key={index}>
                                    <SwiperSlide style={{height : "19rem"}}>
                                      <img src={image.url} style={{objectFit : "contain" , height : "100%" , width : "100%"}} alt="Product Image" />
                                    </SwiperSlide>
                                  </div>
                                );
                              })}
                            </Swiper>
                          </div>
                          <div className="right_side_div_for_the_order_div_in_admin_panel">
                            <div className="name_of_product_div_for_single_div_order">
                              <h4>
                                {singleSale?.sale?.product?.name}
                              </h4>
                            </div>
                            <div className="ordered_quantity_for_the_div_of_single_product" style={{margin : ".5rem 0"}}>
                              <strong>Product Price : </strong>{discounted_price} Rs
                            </div>
                            <div className="ordered_quantity_for_the_div_of_single_product" style={{margin : ".5rem 0"}}>
                              <strong>Ordered Quantity : </strong>{singleSale?.sale?.ordered_quantity}
                            </div>
                            <div className="ordered_quantity_for_the_div_of_single_product" style={{margin : ".5rem 0"}}>
                              <strong>Total Amount : </strong>{singleSale?.sale?.payed_amount} RS
                            </div>
                            <div className="ordered_quantity_for_the_div_of_single_product" style={{margin : ".5rem 0" , display :"flex"}}>
                              <strong>Status : </strong> <span style={{fontWeight : "bold" , display : "flex" , alignItems: "center" , marginLeft : ".5rem"}} className='text-success'>PAID <MdVerified /></span>
                            </div>
                            <div className="lower_user_info_div_given_by_user_in_order">
                              <h3>Contact Info</h3>
                            </div>
                            <div className="ordered_quantity_for_the_div_of_single_product" style={{margin : ".5rem 0"}}>
                              <strong>Name : </strong> <span style={{fontSize : "1.1rem" , fontWeight : "bold" , color : "rgba(0,0,0,0.7)"}}>{user.name}</span>
                            </div>
                            <div className="ordered_quantity_for_the_div_of_single_product" style={{margin : ".5rem 0"}}>
                              <strong>User's Email : </strong> <span style={{fontSize : "1.1rem" , fontWeight : "bold" , color : "rgba(0,0,0,0.7)"}}>{user.email}</span>
                            </div>
                            <div className="ordered_quantity_for_the_div_of_single_product" style={{margin : ".5rem 0"}}>
                              <strong>Order's Email : </strong> <span style={{fontSize : "1.1rem" , fontWeight : "bold" , color : "rgba(0,0,0,0.7)"}}>{singleSale?.sale?.email}</span>
                            </div>
                            <div className="ordered_quantity_for_the_div_of_single_product" style={{margin : ".5rem 0"}}>
                              <strong>Phone : </strong> <span style={{fontSize : "1.1rem" , fontWeight : "bold" , color : "rgba(0,0,0,0.7)"}}>{singleSale?.sale?.phone_number}</span>
                            </div>
                            <div className="ordered_quantity_for_the_div_of_single_product" style={{margin : ".5rem 0"}}>
                              <strong>Address : </strong> <span style={{fontSize : "1.1rem" , fontWeight : "bold" , color : "rgba(0,0,0,0.7)"}}>{singleSale?.sale?.address}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        :
        <div style={{textAlign : "center" , fontSize :  "2rem" , marginTop : "2rem"}}>
          No Sales Yet!
        </div>
      }
    </div>
  )
}

export default ViewSales
// <div className="single_order_main_div_admin_panel">
//   {singleSale?.sale?.payed_amount}
//   <div >
//     Ship
//   </div>
// </div>