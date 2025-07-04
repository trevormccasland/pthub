class WelcomeController < ApplicationController
  def index
    # if logged_in?
    #   @user = current_user
    #   render 'dashboard'
    # else
      render 'landing'
    # end
  end

  private

  def logged_in?
    !current_user.nil?
  end

  def current_user
    @current_user ||= User.find_by(id: session[:user_id])
  end
end