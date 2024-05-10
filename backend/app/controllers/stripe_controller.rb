require 'stripe'

class StripeController < ApplicationController
  STRIPE_API_KEY = 'sk_test_51OpSe52LNoqITNJD12XtHYGr3ZMrwGoKrctDc6jwIMC1PcMNqamMnfTjWKnsn7sOLD4eluv34sSoe1UtNV8MrtP100iwBxlaap'

  def create_checkout_session
    # Parse the JSON request body
    data = JSON.parse(request.body.read)

    # Extract productId and quantity from the request
    product_id = data['productId']
    quantity = data['quantity']

    # Retrieve the price for the product from your database or other source
    # Here, you would typically look up the price associated with the product ID
    # Replace the placeholder '{{PRICE_ID}}' with the actual Price ID corresponding to the product
    # You can fetch the Price ID associated with the product from your database or Stripe
    price_id = find_price_id_for_product(product_id)

    # Create a checkout session with Stripe
    begin
      session = Stripe::Checkout::Session.create({
        line_items: [{
          price: price_id,
          quantity: quantity,
        }],
        mode: 'payment',
        success_url: 'http://localhost:3000?success=true',
        cancel_url: 'http://localhost:3000?canceled=true',
      }, {
        api_key: STRIPE_API_KEY
      })
      render json: { url: session.url }
    rescue Stripe::InvalidRequestError => e
      render json: { error: e.message }, status: :unprocessable_entity
    end
  end

  private

  # Example method to find the Price ID for a product
  def find_price_id_for_product(product_id)
    # Your logic to find the Price ID for the given product ID
    # This could involve querying your database or retrieving it from Stripe
    # For example:
    # price_id = Product.find(product_id).price_id
    # For simplicity, let's assume the price_id is directly associated with the product ID
    price_id = "price_#{product_id}"
  end
end
