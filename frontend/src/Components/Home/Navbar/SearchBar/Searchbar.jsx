import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './SearchBar.css';
import { useNavigate } from 'react-router-dom';

import { BsCheckAll } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";

const Searchbar = () => {
  const [name, setName] = useState('');
  const [searchedItems, setSearchedItems] = useState([]);
  const [noSearchYet, setNoSearchYet] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (name.trim() === '') {
      setSearchedItems([]);
      setNoSearchYet(true);
      return; // Exit useEffect if name is empty
    }

    axios
      .get(`${process.env.REACT_APP_API_URL}/search_product/${name}`)
      .then((res) => {
        console.log(res);
        setSearchedItems(res?.data);
        setNoSearchYet(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [name]);

  return (
    <div className="search_box_dialog_body_main_div">
      <div className="top_input_div_for_search_box">
        <input
          type="search"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Type here to Search Products"
        />
      </div>
      <div className="display_product_info_for_searched_itesm all_products_div_mapping_div_products_main_page">
        {noSearchYet && <div className='no_items_searched_yet_tag_div_for_search_box'>No search yet</div>}
        {searchedItems.map((searchedItem) => {
          const discounted_price = searchedItem.price - (searchedItem.price * (searchedItem.discount / 100))
        return(
          <div className='single_div_for_product_after_mapping' key={searchedItem.id}>
            <div className="top_image_div_for_single_product_div">
              <img src={searchedItem.images[0]} alt="" />
            </div>
            <div className='name_for_single_product_div'>{searchedItem.name}</div>
            <div className="price_and_discount_div_for_the_single_product">
              <div className='price_for_single_product_div'>Price : <span style={{ fontWeight: searchedItem.discount > 0 ? "normal" : "bold" , textDecoration : searchedItem.discount > 0 && "line-through" , color : searchedItem.discount > 0 && "red"}}>{searchedItem.price}</span> {searchedItem.discount > 0 && <span>{discounted_price}</span>} -/ RS</div>
              {searchedItem.discount > 0 &&
                <div className='discount_price_and_percentage_div'>
                  <div className='discount_for_single_product_div btn btn-success'>{searchedItem.discount} % OFF</div>
                </div>
              }
            </div>
            <div className='stock_div_for_single_product_div'><strong style={{marginRight : "1rem"}}>Availability</strong>{searchedItem.quantity > 0 ? <span style={{color : "green" , fontWeight : "600"}}>In Stock <BsCheckAll style={{fontSize : "1.3rem"}}/></span> : <span style={{color : "red" , fontWeight : "600"}}>Out of Stock <FaTimes /> </span>}</div>
            <button className='btn btn-primary' onClick={() => { navigate(`/products/${searchedItem.slug}`); setName('')}} data-bs-dismiss = "modal">Explore</button>
          </div>
        )
            }
          )}
      </div>
    </div>
  );
};

export default Searchbar;
