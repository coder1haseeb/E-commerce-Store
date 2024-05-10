# app/models/product.rb
class Product < ApplicationRecord
  has_many_attached :images, dependent: :destroy
  has_many :orders, dependent: :destroy
  has_many :reviews, dependent: :destroy

  before_create :slugify

  def image_urls
    images.map do |image|
      Rails.application.routes.url_helpers.rails_blob_url(image, only_path: true)
    end
  end

  private

  def slugify
    self.slug = name.parameterize
  end
end
