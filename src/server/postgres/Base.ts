import {IDatabase} from "@/server/_interfaces/IDatabase";
import {QueryResult} from "pg";

export class Base {
    private readonly _adapter: IDatabase;

    constructor(adapter: IDatabase) {
        this._adapter = adapter;
    }

    getUserIdByToken(token: string): Promise<number | null> {
        const query = 'SELECT user_id FROM sessions WHERE token = $1';

        return this.query(query, [token]).then((queryResult: QueryResult) => {
            if(queryResult.rows.length) {
                return queryResult.rows[0].user_id;
            } else {
                return null;
            }
        });
    }

    query(query: string, values?: any[]) {
        return this._adapter.query(query, values);
    }
}