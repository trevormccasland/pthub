# PT Hub

PT Hub is a web app for personal training.

This app will allow a personal trainer to build programs and assign them to clients so they can follow along during their sessions.

## Looking for help!

See [CONTRIBUTING.md](./CONTRIBUTING.md) for information on how to develop and contribute to the project!

## Service Architecture
The following components are designed to be started individually however the postgres DB must be running for the Server and the Server must be running for the Frontend.

- *Actively Being Developed* [Frontend](./frontend/README.md)
- *Actively Being Developed* [Server](./server/README.md)
- *POC only, not active yet* [Data Processing](./posture-analysis/README.md)
- *Public facing, intentionally minimal* [Auth](./auth/README.md)
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