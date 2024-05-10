class ReviewsController < ApplicationController

  def index
    productId = params[:review][:product_id]
    @product = Product.find_by(id: productId)
    if @product
      @reviews = @product.reviews.order(created_at: :asc)
      serialzed_reviews = @reviews.map do |review|
        {
          user: review.user.name,
          review_text: review.review_text,
          rating: review.rating
        }
      end
      render json: serialzed_reviews
    else
      render json: { error: 'Product not found' }, status: :not_found
    end
  end  
  
  def create
    productId = params[:review][:product_id]
    @product = Product.find_by(id: productId)
    @review = @product.reviews.build(review_params)
    if @review.save 
      render json: {
        status: 200,
        message: "Review created Successfully.",
        review: @review
      }
    else
      render json: {
        status: 422,
        message: "Review creation failed.",
        errors: @review.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  private

  def review_params
    params.require(:review).permit(:user_id, :product_id, :review_text, :rating)
  end
end
