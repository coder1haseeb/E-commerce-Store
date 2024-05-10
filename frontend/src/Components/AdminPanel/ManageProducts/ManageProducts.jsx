import React, { useEffect, useState, useRef } from 'react';
import "./ManageProducts.css";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import JoditEditor from 'jodit-react';
import { FaTimes } from "react-icons/fa";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [content, setContent] = useState('');
  const [price, setPrice] = useState(0);
  const [currentImages , setCurrentImage] = useState([])
  const [images, setImages] = useState([]);
  const [enteredQuantity, setEnteredQuantity] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [allImages , setAllImages] = useState([])
  const [showEdit, setShowEdit] = useState(false)
  const navigate = useNavigate();
  const imageRefer = useRef();

  const removeImage = (indexToRemove) => {
    const filteredImages = images.filter((image, index) => index !== indexToRemove);
    setImages(filteredImages);
  };
  
  const removeCurrentImage = (indexToRemove) => {
    setCurrentImage(prevCurrentImages => prevCurrentImages.filter((image, index) => index !== indexToRemove));
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
  
    const totalImages = [...images , ...currentImages]
    setAllImages(totalImages)
    allImages.forEach((image, index) => {
      formData.append(`product[images][]`, image);
    });
    console.log(totalImages.length)
    axios.put(`${process.env.REACT_APP_API_URL}/admin/product_update/${id}`, formData)
    .then(res => {
      console.log(res.data);
      toast.success("Product Updated Successfully");
      setCurrentImage(res.data.images); // Update currentImages state with updated images
    })
    .catch(err => {
      console.log(err);
    });
  };

  const fetchProducts = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/products`)
      .then((res) => {
        setProducts(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
    
  useEffect(() => {
    fetchProducts();
  }, []);
  
  const handleDestroyProduct = (product_id) => {
    const id = product_id
    axios.delete(`${process.env.REACT_APP_API_URL}/admin/delete_product/${id}`)
      .then(res => {
        toast.success(res.data);
        console.log(res);
        fetchProducts();
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div className='manage_products_main_div_for_the_user_div'>
      <div className='heading_for_upload_div_product_div'>Manage Products</div>
      <div className="manage_products_lower_div_for_the_product">
        <div className="all_product_show_for_cart_on_left_side" style={{ width: "100%" }}>
          {products?.map((product) => {
            const discounted_price = product.price - (product.price * (product.discount / 100));
            return (
              <div className='single_cart_item_div_for_carts_show_div admin_panel_manage_product_div_addition' key={product.id}>
                <div className="left_side_image_and_info_div_for_the_product_div_manage_product_div">
                  <div className="left_side_inner_cart_div_image_display">
                    <img src={product.images[0]?.url} alt="Product Image" />
                  </div>
                  <div className="right_side_inner_cart_div_info_display">
                    <h4 className='product_name_for_single_cart_div'>{product.name}</h4>
                    <div className="quantity_and_price_combine_div_for_the_singel_cart">
                      <div className="product_price_by_quantity_div">
                        <strong>Discount</strong> : {product.discount} %
                      </div>
                      <div className="product_price_by_quantity_div">
                        <strong>Price</strong> : {discounted_price}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="right_side_single_contorlls_for_single_product_admin_panel_show_div">
                  <button className='btn btn-success' onClick={() => navigate(`/products/${product.slug}`)}>View</button>
                  <button type="button" className="btn btn-primary" style={{margin : "0 1rem"}} onClick={() => navigate(`/products/${product.slug}/edit`, { state: { product } })}>
                    Edit
                  </button>                   
                  <button className='btn btn-danger' onClick={() => handleDestroyProduct(product.id)}>Delete</button>
                </div>
              </div>
            )
          })}
        </div>  
      </div>
    </div>
  )
}

export default ManageProducts;
