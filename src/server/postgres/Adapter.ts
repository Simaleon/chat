import fs from 'fs';
import * as path from "path";
import postgres from 'pg';
import {IDatabaseConfig} from "@/server/_interfaces/IConfigs";
import {IDatabase} from "@/server/_interfaces/IDatabase";

export class Adapter implements IDatabase {
    private readonly _pool: postgres.Pool;

    constructor(config: IDatabaseConfig) {
        this._pool = new postgres.Pool(config);
    }

    initDatabase(): Promise<boolean> {
        let promises: Array<Promise<any>> = [],
            initQueries: Array<string> = JSON.parse(fs.readFileSync(path.join(__dirname, './configs/initQueries.json'), 'utf8')).initQueries,
            counter: number = 0;

        const initRecursion = () : Promise<boolean> => {
            if(initQueries.length - 1 === counter) {
                return new Promise(resolve => {
                    resolve(true);
                });
            } else {
                return this.query(initQueries[counter]).then((resolve) => {
                    counter++;
                    return initRecursion();
                });
            }
        };

        return initRecursion();
    }

    query(query: string, values?: [...any]): Promise<any> {
        return this._pool.query(query, values).catch(e => {
            console.error(e.stack);
            console.error(query);
            console.error(values);

            throw e;
        });
    }
}