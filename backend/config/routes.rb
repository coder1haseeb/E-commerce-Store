Rails.application.routes.draw do
  get 'stripe/create_checkout_session'
  namespace :admin do
    post '/products' , to: "products#create"
    put "/product_update/:id" , to: "products#update_product"
    put '/product_update_images/:id', to: 'products#update_images'
    put '/product_quantity_update/:id' , to: "products#update_quantity"
    delete '/delete_product/:id' , to: "products#destroy_product"
    resources :orders
    put '/ship_order/:id' , to: "orders#shipment"
    get '/sales' , to: "orders#sales"
  end
  
  resources :reviews  
  resources :carts
  resources :orders
  post '/create-checkout-session', to: 'stripe#create_checkout_session'
  post '/send_email', to: 'email#send_email'
  get "/product/:slug", to: "products#single_product" 
  get '/search_product/:name' , to: "products#search_product"
  resource :products 
  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }
  get '/csrf-token', to: 'application#csrf_token'
end
