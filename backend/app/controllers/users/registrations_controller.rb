class Users::RegistrationsController < Devise::RegistrationsController

  def sign_up_params
    params.require(:user).permit(:name, :username , :email , :password , :password_confirmation , :role , :image)
  end
  
  def account_update_params
    params.require(:user).permit(:name, :username , :email , :password , :password_confirmation , :current_password , :image)
  end
  respond_to :json
  
  private

  def respond_with(resource , options={})
    if resource.persisted?
      render json:{
        status: {
          code: 200 ,
          message: "Signed in Successfully.",
          data: resource,
        }
      }, status: :ok
    else
      render json:{
        status: {
          message: "User can not be created successfully.",
          errors: resource.errors.full_messages
        }, status: :unprocessable_entity
      } 
    end
  end
end
