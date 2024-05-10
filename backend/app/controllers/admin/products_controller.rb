class Admin::ProductsController < Admin::BaseController
    def index
    end

    def create
        if current_user.role == 'admin'
          
            @product = Product.new(product_params.except(:images))
            
            images_with_ids = params.dig(:product, :images)&.map&.with_index do |image, index|
                [index, image]
            end.to_h
        
            images_with_ids.each do |id, image|
                @product.images.attach(io: image, filename: "image_#{id}.png", content_type: 'image/png')
            end
      
            if @product.save
                render json: {
                status: 200,
                message: "Product created successfully.",
                data: @product,
                }  
                else
                    render json: {
                        message: "Something went wrong. Product could not be created now. Try again later."
                        }, status: :unprocessable_entity # Return appropriate status code
            end
            end
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

    def update_images
      @product = Product.find_by(id: params[:id])
      images_to_remove = params[:product][:images_to_remove]
      if images_to_remove
        images_to_remove.each do |image_id|
          image = @product.images.find_by(id: image_id)
          image.purge if image
        end
      end
      
      product_images = params[:product][:images]
      if product_images
        product_images.each do |image|
          @product.images.attach(image)
        end    
      end

      render json: {message: "Images updated Successfully."}
    end

    def update_product
      @product = Product.find_by(id: params[:id])
      
        name = params[:product][:name]
        @product.slug = name.parameterize
    
        
    
        if @product.update(product_params)
          render json: @product
        else
          render json: { message: 'Product update failed.' }, status: :unprocessable_entity
        end
        # Update other product attributes
    end
    
    
    def destroy_product
      @product = Product.find_by(id: params[:id])
      if @product.destroy
        render json: "Product Deleted Successfully."
      else
        render json: "Product can't be deleted now. Try again later."
      end
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

    def update_quantity
      @product = Product.find(params[:id])
      if @product.update(product_params)
        render json:{
          status: 200,
          product: @product
        }
      end
    end

    private

    def product_params
      params.require(:product).permit(:name, :description, :quantity , :stock , :price , :discount , images: [] , images_to_remove: [] , existance: [])
    end
end
