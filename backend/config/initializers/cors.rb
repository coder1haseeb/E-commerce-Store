Rails.application.config.middleware.insert_before 0, Rack::Cors do
    allow do
      origins "*"  # Specify the origins from which requests are allowed, you can replace "*" with specific origins
  
      resource "*",  # Define the resources for which CORS should be configured
        headers: :any,
        methods: [:get, :post, :put, :patch, :delete, :options, :head],
        expose: ["Authorization"]  # Specify any additional headers that you want to expose
    end
  end
  