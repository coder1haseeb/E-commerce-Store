import React, { useRef, useState } from 'react';
import './CreateProduct.css';
import JoditEditor from 'jodit-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { MdDoDisturbOn, MdPadding } from "react-icons/md";

const CreateProduct = () => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [content, setContent] = useState('');
  const [price , setPrice] = useState(0)
  const [discount , setDiscount] = useState(0)
  const [images , setImages] = useState([])
  const imagesRef= useRef();
  const postRef = useRef(1);

  const handleImageChange = (e) => {
    const files = e.target.files;
    const imagesArray = Array.from(files);
    setImages(imagesArray);
  };

  const handleProductCreate = (e) => {
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

    if(discount < 0 || discount > 100){
      toast.error("Enter discount between 0 to 100 if you want.")
    }
  
    if (images.length === 0) {
      toast.error("Product must contain at least one image.");
      return;
    }
  
    const formData = new FormData();
    formData.append('product[name]', name);
    formData.append('product[quantity]', quantity);
    formData.append('product[price]', price);
    formData.append('product[discount]', discount);
    formData.append('product[description]', content);
    images.forEach((image, index) => {
      formData.append(`product[images][]`, image);
    });
  
    axios
      .post(`${process.env.REACT_APP_API_URL}/admin/products`, formData)
      .then((res) => {
        toast.success(res.data.message);
        // Clear fields after successful creation
        setName('');
        setQuantity(0);
        setContent('');
        setDiscount(0);
        setPrice(0);
        setImages([]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const removeImage = (indexToRemove) => {
    const filteredImages = images.filter((image, index) => index !== indexToRemove);
    setImages(filteredImages);
  };

  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  return (
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
              // config={{
              //   placeholder: 'Write description... <span style={{color : "red"}}>*</span>'
              // }}
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
                <div key={index} className='single_image_div_for_the_upload_display' style={{display : 'flex' , alignItems : "flex-start"}}>
                  <img src={URL.createObjectURL(image)} alt={`Product Image ${index}`} />
                  <button className="btn btn-danger remove_image_btn" style={{padding :".4rem"}} onClick={() => removeImage(index)}><MdDoDisturbOn /></button>
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
      <button className='btn btn-success submit_btn_for_product_creattion' onClick={handleProductCreate}>
        Create Product
      </button>
    </form>
  );
};

export default CreateProduct;
