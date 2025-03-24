# PT Hub

PT Hub is a web app for personal training.

This app will allow a personal trainer to build programs and assign them to clients so they can follow along during their sessions.

## Service Architecture
- Frontend
- Server
- Data Processing
- Auth
- Test

```


+---------------+
|     Test      |
+---------------+
       ^
       | (Tests)
       |
       v
+---------------+      (HTTP/HTTPS)      +---------------+      (Data Flow)      +---------------+
|   Frontend    | <--------------------> |    Server     | --------------------> | Data Process  |
+---------------+                        +---------------+                       +---------------+
        ^                                      ^                                        ^
        | (User)                               | (Logic)                   (Transform)  | 
        |                                      |                                        |
        v                                      v                                        v
+---------------+      (Auth Token)      +---------------+      (Storage)      +---------------+
|      User     | <--------------------> |     Auth      | -----------------> |  Database/    |
+---------------+                        +---------------+                     |    Cache      |
                                         ^                                     +---------------+
                                         | (Auth/Authz)
                                         |
                                         v
                                  +---------------+
                                  | Identity Prov.|
                                  | Ext. Auth    |
                                  +---------------+

Legend:

<-----> : Two-way comm.
-----> : One-way comm.
^ : Upward flow.
v : Downward flow.
( ) : Description.
```