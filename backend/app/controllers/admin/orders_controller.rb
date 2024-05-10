class Admin::OrdersController < Admin::BaseController

  def index
    @orders = Order.where(is_shipped: false)
    serialized_orders = @orders.map do |order|
      product = Product.find_by(id: order.product_id)
      user = User.find_by(id: order.user_id)
  
      if product.present? && product.images.attached?
        product_images = product.images.map { |image| { id: image.id, url: rails_blob_url(image) } }
      else
        product_images = []
      end
  
      {
        order: {
          id: order.id,
          address: order.address,
          email: order.email,
          is_shipped: order.is_shipped,
          ordered_quantity: order.ordered_quantity,
          payed_amount: order.payed_amount,
          phone_number: order.phone_number,
          product: {
            id: product&.id,
            name: product&.name,
            description: product&.description,
            slug: product&.slug,
            price: product&.price,
            quantity: product&.quantity,
            discount: product&.discount,
            images: product_images
          },
          user: {
            id: user&.id,
            name: user&.name,
            username: user&.username,
            email: user&.email,
            role: user&.role
          }
        }
      }
    end
    render json: serialized_orders
  end
  
  def sales
    @sales = Order.where(is_shipped: true)
    
    # Ensure @sales is not nil
    @sales ||= []
    
    serialized_sales = @sales.map do |sale|
      product = Product.find_by(id: sale.product_id)
      user = User.find_by(id: sale.user_id)
  
      if product.present? && product.images.attached?  # Check if product and product.images exist
        {
          sale: {
            id: sale.id,
            address: sale.address,
            email: sale.email,
            is_shipped: sale.is_shipped,
            ordered_quantity: sale.ordered_quantity,
            payed_amount: sale.payed_amount,
            phone_number: sale.phone_number,
            product: {
              id: product.id,
              name: product.name,
              description: product.description,
              slug: product.slug,
              price: product.price,
              quantity: product.quantity,
              discount: product.discount,
              images: product.images.map { |image| { id: image.id, url: rails_blob_url(image) } }
            },
            user: {
              id: user&.id,
              name: user&.name,
              username: user&.username,
              email: user&.email,
              role: user&.role
            }
          }
        }
      else
        # Handle case where product or product.images is nil
        {
          sale: {
            id: sale.id,
            address: sale.address,
            email: sale.email,
            is_shipped: sale.is_shipped,
            ordered_quantity: sale.ordered_quantity,
            payed_amount: sale.payed_amount,
            phone_number: sale.phone_number,
            product: nil,  # Set product to nil
            user: {
              id: user&.id,
              name: user&.name,
              username: user&.username,
              email: user&.email,
              role: user&.role
            }
          }
        }
      end
    end
    render json: serialized_sales
  end
  

  def shipment
    @order = Order.find_by(id: params[:id])
    if @order.nil?
      render json: { message: "Order not found" }, status: :not_found
      return
    end
    if @order.update(order_params)
      render json: {
        message: "Order Shipped Successfully.",
        order: @order
      }
    else
      render json: {
        message: "Failed to ship order."
      }, status: :unprocessable_entity
    end
  end
  private

  def order_params
    params.require(:order).permit(:product_id, :user_id, :ordered_quantity, :payed_amount, :is_shipped , :address , :phone_number , :email )
  end
end