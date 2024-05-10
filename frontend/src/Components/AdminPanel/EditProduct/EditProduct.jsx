import React, { useState , useRef ,useEffect } from 'react';
import './EditProduct.css';
import { useLocation ,useNavigate} from 'react-router-dom';
import JoditEditor from 'jodit-react';
import { FaTimes } from "react-icons/fa";
import {toast} from 'react-toastify'
import axios from 'axios';

const EditProduct = () => {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [content, setContent] = useState('');
    const [price, setPrice] = useState(0);
    const [currentImages , setCurrentImage] = useState([])
    const [images, setImages] = useState([]);
    const [enteredQuantity, setEnteredQuantity] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [imagesToRemove, setImagesToRemove] = useState([]);
    const [allImages , setAllImages] = useState([])
    const location = useLocation();
    const imageRefer = useRef();
    const { product } = location.state;
    const navigate = useNavigate()
    // console.log(product);

    useEffect(() => {
        if (product) {
            setName(product.name);
            setQuantity(product.quantity);
            setContent(product.description);
            setPrice(product.price);
            setCurrentImage(product.images);
        }
    }, [product]);

    const removeImage = (indexToRemove) => {
        const filteredImages = images.filter((image, index) => index !== indexToRemove);
        setImages(filteredImages);
      };
      
      const removeCurrentImage = (indexToRemove) => {
        setCurrentImage(prevCurrentImages => prevCurrentImages.filter((image, index) => index !== indexToRemove));
        setImagesToRemove([...imagesToRemove, currentImages[indexToRemove]]);
      };
      
      
      const handleImageChange = (e) => {
        const files = e.target.files;
        const imagesArray = Array.from(files);
        setImages(imagesArray);
      };
    
      const handleContentChange = (newContent) => {
        setContent(newContent);
      };
      
      const handleProductUpdate = (id, e) => {
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
      
        const formData = new FormData();
        formData.append('product[name]', name);
        formData.append('product[quantity]', quantity);
        formData.append('product[price]', price);
        formData.append('product[discount]', discount);
        formData.append('product[description]', content);
        
        
        console.log(formData.name);
        
        axios.put(`${process.env.REACT_APP_API_URL}/admin/product_update/${id}` , formData)
        .then((res) => {
          toast.success("Product Updated Successfully.");
          console.log(res.data);
          setCurrentImage(res.data.images);
          navigate(`/products/${res.data.slug}`)
        }) // Update currentImages state with updated images
        .catch((err) => {
          console.error(err);
          toast.error(err.message);
        });
        
      };

      const handleImagesUpdate = (id , e ) =>{
        e.preventDefault()
        const formData = new FormData();
        images.forEach((image, index) => {
          formData.append(`product[images][]`, image);
          // console.log(image);
        });
        
        currentImages.forEach((image, index) => {
          formData.append(`product[images][]`, image.url); 
          // console.log(image.url);// Assuming image.url is the image URL
        });
        
        imagesToRemove.forEach((image) => {
          formData.append('product[images_to_remove][]', image.id); // Assuming image.id is the image ID
        });

        axios.put(`${process.env.REACT_APP_API_URL}/admin/product_update_images/${id}` , formData)
        .then((res) => {
          toast.success("Product Updated Successfully.");
          console.log(res.data);
          setCurrentImage(res.data.images);
        }) // Update currentImages state with updated images
        .catch((err) => {
          console.error(err);
          // toast.error(err.message);
        });
        setTimeout(() =>{
          toast.info(`Redirected to ${product.name}`)
          navigate(`/products/${product.slug}`)
        },1000) 
      }
      
      return (
        <div style={{margin : "2rem"}}>
            <div className='create_product_main_div_page'>
            <div className='left_side_product_fields_div_create_product'>
                <div className='heading_for_upload_div_product_div'>Update Product</div>
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
                    <label htmlFor='floatingInput'>Product Name <span style={{ color: "red" }}>*</span></label>
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
                    <label htmlFor='floatingInput'>Product Quantity <span style={{ color: "red" }}>*</span></label>
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
                    <label htmlFor='floatingInput'>Product Price <span style={{ color: "red" }}>*</span></label>
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
                />
                <button className='btn btn-success submit_btn_for_product_creattion' onClick={(e) => handleProductUpdate(product.id, e)}>
                  Update Info
                </button>
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
                    ref={imageRefer}
                />
                <label htmlFor="floatingInput">Images <span style={{ color: "red" }}>*</span></label>
                </div>
                {/* Display uploaded images */}
                {images.length > 0 ?
                <div className='show_all_selected_images_div_for_the_upload_div'>
                    {images.map((image, index) => (
                    <div key={index} className='single_image_div_for_the_upload_display' style={{display : 'flex' , alignItems : "flex-start"}}>
                        <img src={URL.createObjectURL(image)} alt={`Product Image ${index}`} />
                        <button className="btn btn-danger remove_image_btn" style={{padding :".4rem"}} onClick={() => removeImage(index)}><FaTimes /></button>
                    </div>
                    ))}
                </div>
                :
                <center style={{ marginTop: "2rem" }}>
                    <div className='not_images_selected_div_for_display_at_creation'>No Images Selected Yet</div>
                </center>
                }
                <div>
                <h4>Current Images</h4>
                </div>
                <div className='show_all_selected_images_div_for_the_upload_div'>
                {currentImages && currentImages.map((image, index) => (
                    <div className='single_image_div_for_the_upload_display' key={index}>
                    <button className="btn btn-danger remove_image_btn" onClick={() => removeCurrentImage(index)}><FaTimes /></button>
                    <img src={image.url} alt={`Product Image ${index}`} />
                    </div>
                ))}
                </div>
                <button className='btn btn-success submit_btn_for_product_creattion' onClick={(e) => handleImagesUpdate(product.id, e)}>
                  Update Images
                </button>
            </div>
            </div>
        </div>     
    );
};

export default EditProduct;
