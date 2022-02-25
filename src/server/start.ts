import {Adapter} from "@/server/postgres/Adapter";
import {IConfig} from "@/server/_interfaces/IConfigs";
import {Server} from "@/server/Server";
import fs from "fs";
import * as path from "path";

const config: IConfig = JSON.parse(fs.readFileSync(path.join(__dirname, './configs/config.json'), 'utf8')),
    databaseAdapter = new Adapter(config.database);

databaseAdapter.initDatabase().then((result: boolean) => {
    console.log('Success creating database');

    const server = new Server(databaseAdapter, config.server);
});