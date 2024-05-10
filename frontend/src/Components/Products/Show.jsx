import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import JoditEditor from 'jodit-react';
import { useNavigate } from 'react-router-dom';

const Show = () => {
     const [name, setName] = useState('');
     const [quantity, setQuantity] = useState(0);
     const [content, setContent] = useState('');
     const [price, setPrice] = useState(0);
     const [discount, setDiscount] = useState(0);
     const { slug } = useParams();
     const [product, setProduct] = useState({});
     const [images , setImages] = useState([])
     const imagesRef= useRef();
     const postRef = useRef(1);
   
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

     useEffect(() => {
          axios.get(`${process.env.REACT_APP_API_URL}/product/${slug}`).then(res => {
               setProduct(res.data)
               console.log(res.data)
          }).catch(err => {
               console.log(err);
          })
     }, []);

     const parseHTML = (description) => {
          return { __html: description };
     };

     const handleContentChange = (newContent) => {
          setContent(newContent);
     };

     const handleProductUpdate = (e) => {
          e.preventDefault();
          if (!name || !quantity || !content || !price) {
               toast.error("All fields are required.");
               return;
          }

          if (quantity <= 0) {
               toast.error("Quantity should be greater than zero.");
               return;
          } else if (price <= 0) {
               toast.error("Price must be greater than 0.");
               return;
          }
          axios.put(`${process.env.REACT_APP_API_URL}/product_update/${slug}`, data).then(res => {
               setProduct(res.data);
               console.log(res.data);
               toast.success("Product Updated Successfully")
          }).catch(err => {
               console.log(err);
          });
     };

     return (
          <div>
               <h1>
                    {product.name}
               </h1>
               <div dangerouslySetInnerHTML={parseHTML(product.description)}>
               </div>

               <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => {
                    setName(product.name);
                    setDiscount(product.discount);
                    setContent(product.description);
                    setPrice(product.price);
                    setQuantity(product.quantity);
               }}>
                    Edit this product
               </button>

               <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-fullscreen modal-dialog-scrollable modal-dialog-centered">
                         <div className="modal-content">
                              <div className="modal-header">
                                   <h1 className="modal-title fs-5" id="exampleModalLabel">{product.name}</h1>
                                   <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>
                              <div className="modal-body">
                              <form>
        <div className='create_product_main_div_page'>
        <div className='left_side_product_fields_div_create_product'>
            <div className='heading_for_upload_div_product_div'>Create Product</div>
            <div className='fields_for_product_to_upload_data_div'>
                <div className='form-floating mb-3'>
                <input
                    type='text'
                    value={name}
                    required
                    onChange={(e) => setName(e.target.value)}
                    className='form-control'
                    id='floatingInput'
                    placeholder='name@example.com'
                />
                <label htmlFor='floatingInput'>Product Name <span style={{color : "red"}}>*</span></label>
                </div>
                <div className='three_fields_div_for_the_product_page'>
                    <div className='form-floating mb-3'>
                    <input
                        type='number'
                        value={quantity}
                        min={1}
                        required
                        onChange={(e) => setQuantity(e.target.value)}
                        className='form-control'
                        id='floatingInput'
                        placeholder='name@example.com'
                        />
                    <label htmlFor='floatingInput'>Product Quantity <span style={{color : "red"}}>*</span></label>
                    </div>
                    <div className='form-floating mb-3'>
                    <input
                        type='number'
                        value={price}
                        min={1}
                        required
                        onChange={(e) => setPrice(e.target.value)}
                        className='form-control'
                        id='floatingInput'
                        placeholder='name@example.com'
                        />
                    <label htmlFor='floatingInput'>Product Price <span style={{color : "red"}}>*</span></label>
                    </div>
                    <div className='form-floating mb-3'>
                    <input
                        type='number'
                        value={discount}
                        min={0}
                        onChange={(e) => setDiscount(e.target.value)}
                        className='form-control'
                        id='floatingInput'
                        placeholder='name@example.com'
                        />
                    <label htmlFor='floatingInput'>Product Discount (Optional)</label>
                    </div>
                </div>
                <JoditEditor
                value={content}
                tabIndex={1}
                onChange={handleContentChange}
                config={{
                  placeholder: 'Write description... <span style={{color : "red"}}>*</span>'
                }}
                />
            </div>
        </div>
        <div className='right_side_product_images_div_for_upload'>
            <div className='heading_for_upload_div_product_div'>Upload Images</div>
            <center>Multiple Images are allowed to be uploaded.</center>
            <center className='alert alert-warning'><strong>Note : </strong>First Image you will select, will be displayed as the product image.</center>
            <hr />
                <div className="form-floating mb-3">

                  <input 

                    type="file" 
                    multiple // Allow multiple file selection
                    onChange={handleImageChange} 
                    className="form-control" 
                    id="floatingInput" 
                    placeholder="name@example.com" 
                    ref={imagesRef}
                  />
                  <label htmlFor="floatingInput">Images <span style={{color : "red"}}>*</span></label>
              </div>
            {/* Display uploaded images */}
              {images.length > 0 ? 
                <div className='show_all_selected_images_div_for_the_upload_div'>
                    {images.map((image, index) => (
                      <div className='single_image_div_for_the_upload_display'>
                      <img key={index} src={URL.createObjectURL(image)} alt={`Product Image ${index}`} />
                      </div>
                    ))}
                </div>
              :
                <center style={{marginTop : "2rem"}}>
                  <div className='not_images_selected_div_for_display_at_creation'>No Images Selected Yet</div>
                </center>
              }
        </div>
        </div>
                <button className='btn btn-success submit_btn_for_product_creattion' onClick={handleProductUpdate}>
                Update Product
                </button>
        </form>
                              </div>
                              <div className="modal-footer">
                                   <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
};

export default Show;
