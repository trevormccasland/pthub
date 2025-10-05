# PT Hub Server

Express Server to support the PT Hub frontend

## Tech Used
* TypeORM
* PostgreSQL
* Express
* Node.JS

## Dev Setup

### Install Dependencies
```bash
npm install
```

### Databasee Setup
Currently there are no migrations. To make changes to the schema, we currently just delete the schema in postgres and let TypeORM recreate it.

#### Postgres Setup with PgAdmin
Add the version of PgAdmin you tested with here if it passed:
* PgAdmin4 v8

> [!NOTE]
> Currently `pthub` is hardcoded in the app for these settings.

1. Create a Login Role for the app and name it `pthub`. On the Privileges tab, enable all the options.
2. Create a database, name it `pthub`, mark the owner as `pthub`.
3. Create a schema, name it `pthub`, mark the owner as `pthub`.
4. Start the server to create the schema
5. (optional) Run the workoutImporter.ts file with `npx ts-node src/workoutImporter.ts`.
    - The workoutImporter.ts only works with excel files that have a particular format. I added a file [Body weight 4.xlsx](./src/Body%20weight%204.xlsx) as a sample.
6. (optional) Run the [coreWorkoutImporter](./src/data/coreWorkouts/coreWorkoutImporter.ts)
    - this will import the workouts in csv format there.

### How to Run
```bash
npm start
```