# Authentication Service

* Ruby version 3.6.6

## Tech

* Google OAuth
* Sqlite

## Developer Setup

### Install dependencies
```bash
bundle install
```

### DB Setup
```bash
rails db:migrate # to apply all migrations
rails db:rollback # to revert latest migration
```

### OAuth Configuration
```bash
cp .env.example .env
```

Update .env file values GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET with your auth client at https://console.cloud.google.com/auth/clients

### How to Run
```bash
rails server
```