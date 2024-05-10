class ProductsController < ApplicationController
  
    def index
    end
    
    def show
      @products = Product.all
      products_with_images = @products.map do |product|
        {
          id: product.id,
          name: product.name,
          description: product.description,
          slug: product.slug,
          price: product.price,
          quantity: product.quantity,
          discount: product.discount,
          images: product.images.map { |image| { id: image.id, url: rails_blob_url(image) } }
        }
      end
      render json: products_with_images
    end

    def single_product
      @product = Product.find_by(slug: params[:slug])
      if(current_user)
        @cart = current_user.carts.find_by(product_id: @product.id)
        isEligible = current_user.orders.find_by(product_id: @product.id)
      end
      total_possible_rating = 5 * @product.reviews.count
      total_score = @product.reviews.sum(:rating)
      ratio = total_score.to_f / total_possible_rating * 5  # Calculate ratio out of 5 stars
      
      product_data = {
        product: @product.as_json(include: :images).merge(
          images: @product.images.map { |image| { id: image.id, url: rails_blob_url(image) } } ,
          ratings: ratio,
          isEligible: isEligible
        )
      }
    
      if @cart.present?
        product_data[:cart] = @cart
      end
    
      render json: product_data
    end
       

    def search_product
      @products = Product.where("name LIKE ?", "%#{params[:name]}%")
      products_with_images = @products.map do |product|
        {
          id: product.id,
          name: product.name,
          description: product.description,
          slug: product.slug,
          price: product.price,
          quantity: product.quantity,
          discount: product.discount,
          images: product.images.map { |image| rails_blob_url(image) }
        }
      end
      render json: products_with_images
    end    


    private

    def product_params
      params.require(:product).permit(:name, :description, :quantity , :stock , :price , :discount , images: [] , images_to_remove: [] , existance: [])
    end
end
