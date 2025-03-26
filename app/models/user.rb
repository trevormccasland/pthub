class User < ApplicationRecord
  validates_presence_of :google_client_id
  validates_uniqueness_of :google_client_id

  def self.find_or_create_from_auth_hash(auth)
    puts auth
    user = find_or_create_by(google_client_id: auth["uid"])
  	user.first_name = auth["info"]["first_name"]
  	user.last_name = auth["info"]["last_name"]
  	user.email = auth["info"]["email"]
    user.token = auth["credentials"]["token"]
    user.refresh_token = auth.info.refresh_token
  	user.save
    user
  end
end