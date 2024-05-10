import React, { useEffect, useState } from 'react';
import './AdminPanel.css';
import ManageProducts from './ManageProducts/ManageProducts';
import ViewSales from './ViewSales/ViewSales';
import CheckOrders from './CheckOrders/CheckOrders';
import CreateProduct from '../Products/CreateProduct/CreateProduct'

const AdminPanel = () => {
  const [createProduct , setcreateProduct] = useState(true)
  const [manageProducts , setManageProducts] = useState(false)
  const [viewSales , setViewSales ] = useState(false)
  const [checkOrders , setCheckOrders ] = useState(false)

  return (
    <div className='admin_panel_main_page_div'>
      {/* <div className='heading_for_upload_div_product_div'>Welcome to Admin Panel</div> */}
      <div className="lower_div_for_controlls_div_for_admin_panel">
        <div className="left_side_panle_slider_div_for_the_buttons">
          <div className="manage_proudcts_button_for_the_user btn btn-success" onClick={() => {setcreateProduct(!createProduct) ; setViewSales(false) ; setCheckOrders(false) ; setManageProducts(false)}}>
            Create Product
          </div>
          <div className="manage_proudcts_button_for_the_user btn btn-info" onClick={() => {setManageProducts(!manageProducts) ; setViewSales(false) ; setCheckOrders(false); setcreateProduct(false)}}>
            Manage Product
          </div>
          <div className="check_orders_from_client_div_admin_panel btn btn-warning" onClick={() => {setCheckOrders(!checkOrders) ; setcreateProduct(false) ; setViewSales(false) ; setManageProducts(false)}}>
            Check Orders
          </div>
          <div className="view_sales_button_for_the_past_div_for_amdin_panel btn btn-primary" onClick={() => {setViewSales(!viewSales) ; setcreateProduct(false) ; setCheckOrders(false) ; setManageProducts(false)}}>
            View Sales
          </div>
        </div>
        <div className="right_side_display_container_for_the_user">
          {createProduct &&
            <CreateProduct />
          }
          {manageProducts &&
            <ManageProducts />
          }
          {viewSales &&
            <ViewSales />
          }
          {checkOrders &&
            <CheckOrders />
          }
          {!viewSales && !createProduct && !checkOrders && !manageProducts&&
            <h2 className='no_active_tabs_for_the_admin_panel_div_page'>No Active Tabs yet!</h2>
          }
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
