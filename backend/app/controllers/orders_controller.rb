class OrdersController < ApplicationController

  def create
    @order = current_user.orders.build(order_params)
    if @order.save
      render json: {
        status: 200,
        message: "Order placed Successfully.",
        order: @order
      }      
    else
      render json: {message: "Order can't be placed now. Try again later!"}
    end
  end
  
  private

  def order_params
    params.require(:order).permit(:product_id, :user_id, :ordered_quantity, :payed_amount, :is_shipped , :address , :phone_number , :email )
  end
end