class EmailController < ApplicationController
    def send_email
      recipient = params[:recipient]
      subject = params[:subject]
      message = params[:message]
  
      begin
        mail = Mail.new do
          from    'coder.haseeb@gmail.com'
          to      recipient
          subject subject
          body    message
        end
        mail.deliver
        render json: { message: 'Email sent successfully' }, status: :ok
      rescue => e
        render json: { error: e.message }, status: :unprocessable_entity
      end
    end
  end
  