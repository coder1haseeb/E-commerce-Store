class AddFieldsToProducts < ActiveRecord::Migration[7.0]
  def change
    add_column :products, :price, :integer
    add_column :products, :slug, :string
    add_column :products, :discount, :integer,
  end
end
