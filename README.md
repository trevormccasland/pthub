# PT Hub

PT Hub is a web app for personal training.

This app will allow a personal trainer to build programs and assign them to clients so they can follow along during their sessions.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for information on how to develop and contribute to the project!

## Service Architecture
- Frontend
- Server
- Data Processing
- Auth
- Test

```


                                                   +----------+                                    
                                                   | Block    |     low-frequency storage          
                                                 +-+ Storage  |<-------------------------+         
                                                 | |          |                          |         
                                                 | +----------+                          |         
                                                 |                                       |         
                                                 |                                       |         
+---------------+                                |                               +---------------+ 
|     Test      |                                |                               | Data Process  | 
+---------------+                                |                               +---------------+ 
       ^                                         |                                      ^          
       | (Tests)                                 |                                      |          
       |                                         |                                      |yes       
       v                                         v                                      |          
+---------------+      (HTTP/HTTPS)      +---------------+      (Data Flow)             |          
|   Frontend    | <--------------------> |    Server     | -------------------->    Has Video?     
+---------------+                        +---------------+                              |           
        ^                                      ^                                        |           
        | (User)                               | (Logic)                                |No        
        |                                      |                                        |          
        v                                      v                                        v          
+---------------+      (Auth Token)      +---------------+      (Storage)      +---------------+   
|      User     | <--------------------> |     Auth      | ------------------> |  Database/    |   
+---------------+                        +---------------+                     |    Cache      |   
                                         ^                                     +---------------+   
                                         | (Auth/Authz)                                            
                                         |                                                         
                                         v                                                         
                                  +---------------+                                                
                                  | Identity Prov.|                                                
                                  | Ext. Auth     |                                                
                                  +---------------+                                                
Legend:

<-----> : Two-way comm.
-----> : One-way comm.
^ : Upward flow.
v : Downward flow.
( ) : Description.
```