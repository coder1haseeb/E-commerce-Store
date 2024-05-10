class CreateOrders < ActiveRecord::Migration[7.0]
  def change
    create_table :orders do |t|
      t.integer :product_id
      t.integer :user_id
      t.integer :ordered_quantity
      t.integer :payed_amount
      t.boolean :is_shipped

      t.timestamps
    end
  end
end
  