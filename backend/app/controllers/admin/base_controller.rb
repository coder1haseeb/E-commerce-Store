class Admin::BaseController < ApplicationController
    before_action :authenticate_admin!

    protected

    def authenticate_admin!
        if current_user.role != 'admin'
            return render json: {message: "Not an admin"}
        end
    end
end 