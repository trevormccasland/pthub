Rails.application.routes.draw do
  root 'welcome#index'
  get '/auth/:provider/callback', to: 'sessions#google_auth'
  get '/favicon.ico', to: redirect(ActionController::Base.helpers.asset_path('favicon.ico'))
  get 'auth/failure', to: redirect('/')
  get 'signout', to: 'sessions#destroy', as: 'signout'
end