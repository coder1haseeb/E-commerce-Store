class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self
  def jwt_payload
    super
  end
  has_one_attached :image
  has_many :carts , dependent: :destroy
  has_many :orders , dependent: :destroy
  # before_create :attach_image
  has_many :reviews , dependent: :destroy 
  # before_create :attach_image
  # def attach_image
  #   self.image = params[:image]
  # end
end
