class AddFieldsToOrder < ActiveRecord::Migration[7.0]
  def change
    add_column :orders, :address, :string
    add_column :orders, :phone_number, :string
    add_column :orders, :email, :string
  end
end
