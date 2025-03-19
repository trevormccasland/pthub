import "reflect-metadata"
import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "pthub",
    password: "secret",
    database: "pthub",
    synchronize: true,
    logging: false,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    migrations: [],
    subscribers: [],
})
