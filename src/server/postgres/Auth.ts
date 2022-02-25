import {QueryResult} from "pg";
import {Base} from "@/server/postgres/Base";

export class Auth extends Base{
    getCredentialByLogin(login: string): Promise<{
        id: string,
        hash: string
    } | null> {
        const query = 'SELECT id, hash FROM users WHERE login=$1';

        return this.query(query, [login]).then((queryResult: QueryResult) => {
            if(queryResult.rowCount > 0) {
                return queryResult.rows[0];
            } else {
                return null;
            }
        });
    }

    login(id: string, token: string, expires: Date, isSession: boolean): Promise<boolean> {
        const query = 'INSERT INTO sessions (user_id, token, expire, is_session) VALUES($1, $2, $3, $4)';

        return this.query(query, [id, token, expires, isSession]).then((queryResult: QueryResult) => {
            return queryResult.rowCount > 0;
        });
    }

    logout(token: string): Promise<boolean> {
        const query = 'DELETE FROM sessions WHERE token = $1';

        return this.query(query, [token]).then((queryResult: QueryResult) => {
            return true;
        });
    }

    registerByEmail(login: string, hash: string): Promise<string | null> {
        const query = 'INSERT INTO users (login, hash) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING id, login';

        return this.query(query, [login, hash]).then((queryResult: QueryResult) => {
            if(queryResult.rowCount > 0) {
                return queryResult.rows[0].id;
            } else {
                return null;
            }
        });
    }

    prolongToken(token: string, date: Date): Promise<boolean | null> {
        const query = 'UPDATE sessions SET expire = $1 WHERE token = $2 AND is_session != true';

        return this.query(query, [date, token]).then((queryResult: QueryResult) => {
            return queryResult.rowCount > 0;
        });
    }
}