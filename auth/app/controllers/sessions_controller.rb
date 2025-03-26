class SessionsController < ApplicationController
  def google_auth
    user_data = request.env['omniauth.auth']
    @user = User.find_or_create_from_auth_hash(user_data)
    session[:user_id] = @user.id
    redirect_to root_path, notice: 'Successfully logged in with Google'
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_path, notice: 'Successfully logged out'
  end

  def failure
    redirect_to root_path, alert: "Authentication failed, please try again."
  end
end