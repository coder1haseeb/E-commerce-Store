class CartsController < ApplicationController
  def index
    @carts = current_user.carts.all.order("created_at")
    
    if @carts.present?
      carts_with_product_details = @carts.map do |cart|
        product = Product.find_by(id: cart.product_id)
        if product.present?
          {
            id: cart.id,
            items_quantity: cart.items_quantity,
            created_at: cart.created_at,
            updated_at: cart.updated_at,
            user_id: cart.user_id,
            product: {
              id: product.id,
              name: product.name,
              description: product.description,
              slug: product.slug,
              price: product.price,
              quantity: product.quantity,
              discount: product.discount,
              images: product.images.map { |image| { id: image.id, url: rails_blob_url(image) } }
            }
          }
        else
          # If product not found for a cart, skip it or   as per your requirement
          nil
        end
      end.compact
      
      render json: {
        status: 200,
        carts: carts_with_product_details
      }, status: :ok
    else
      render json: {
        message: "No carts found for the current user."
      }, status: :not_found
    end
  end
  

  def create
    @cart = current_user.carts.new(cart_params)
    if @cart.save
      render json: {
        stauts: 200,
        cart: @cart,
      } , stauts: :ok
    else
      render json: {
        message: "Can't add to Cart right now. Please try again later,"
      }
    end
  end

  def show
  end

  def destroy
    @cart = current_user.carts.find(params[:id])
    if @cart.destroy
      render json: {message: "Cart Deleted Successfully."}
    else
      render json: {message: "Unable to delete cart item now. Try again later."}
    end
  end
  
  def update
    @cart = current_user.carts.find(params[:id])
    if @cart.update(cart_params)
      render json: {message: "Cart Updated Successfully."}
    else
      render json: {message: "Unable to update cart now. Try again later."}
    end
  end

  private

  def cart_params 
    params.require(:cart).permit(:user_id , :product_id , :items_quantity)
  end
end
