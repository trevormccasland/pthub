class AddGoogleAuthToUsers < ActiveRecord::Migration[7.2]
  def change
    add_column :users, :first_name, :string
    add_column :users, :last_name, :string
    add_column :users, :token, :string
    add_column :users, :google_client_id, :string
    add_column :users, :refresh_token, :string
  end
end
