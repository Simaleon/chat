import {QueryResult} from "pg";
import {v4 as uuid} from "uuid";
import {Base} from "@/server/postgres/Base";

export interface IDialog {
    is_first: boolean
    text: string
    time: number
    user_name: string
    message_id: number
}

export interface IDialogs {
    dialog_id: number
    user_name_1: string
    text_1: string
    time_1: number
    user_name_2: string
    text_2: string
    time_2: number
}

export class Messages extends Base {
    answerMessage(userToken: string, message_id: string, answer: string): Promise<boolean> {
        const query = 'WITH t1 AS (SELECT user_id FROM sessions WHERE token = $1),\n' +
            '\tt2 AS (SELECT dialog_id FROM messages WHERE id = $2)\n' +
            '\tINSERT INTO messages (user_id, text, reply_to, dialog_id) VALUES ((SELECT user_id FROM t1), $3, $2, (SELECT dialog_id FROM t2)) RETURNING id';

        return this.query(query, [userToken, message_id, answer]).then((queryResult: QueryResult) => {
            return queryResult.rows.length > 0;
        });
    }

    createDialog(userToken: string, message_id: number, answer: string, user_name?: string): Promise<boolean> {
        const query = 'WITH t1 AS (SELECT user_id FROM sessions WHERE token = $1),\n' +
            '\tt2 AS (SELECT user_id, message, user_name, time FROM flying_messages WHERE id = $2),\n' +
            '\tdialog AS (INSERT INTO dialogs (user_id_1, user_name_1, user_id_2, user_name_2) VALUES ((SELECT user_id FROM t2), (SELECT user_name FROM t2), (SELECT user_id FROM t1), $4) RETURNING id),\n' +
            '\tstart_message AS (INSERT INTO messages (user_id, text, time, dialog_id) VALUES ((SELECT user_id FROM t2), (SELECT message FROM t2), (SELECT TIME FROM t2), (SELECT id FROM dialog)) RETURNING id)\n' +
            'INSERT INTO messages (user_id, text, dialog_id, reply_to) VALUES ((SELECT user_id FROM t1), $3, (SELECT id FROM dialog), (SELECT id FROM start_message))';

        return this.query(query, [userToken, message_id, answer, user_name || '']).then((queryResult: QueryResult) => {
            return true;
        });
    }

    getDialog(userToken: string, dialog_id: number, offset: number = 0): Promise<IDialog[]> {
        const query = 'WITH t1 AS (SELECT user_id FROM sessions WHERE token = $1),\n' +
            '\tt2 AS (SELECT id FROM dialogs WHERE id = $2 AND (user_id_1 = (SELECT user_id FROM t1) OR user_id_2 = (SELECT user_id FROM t1)))\n' +
            '\tSELECT messages.reply_to AS reply, messages.id AS id, messages.text AS text, messages.time AS time, messages.user_id AS user_id,\n' +
            '\tdialogs.user_id_1 AS user_id_10, dialogs.user_id_2 AS user_id_20, dialogs.user_name_1 AS user_name_10, dialogs.user_name_2 AS user_name_20\n' +
            '\tFROM messages JOIN dialogs ON messages.dialog_id = dialogs.id\n' +
            '\tWHERE messages.dialog_id = (SELECT id FROM t2)\n' +
            '\tORDER BY time DESC\n' +
            '\tLIMIT 5 OFFSET $3';

        return this.query(query, [userToken, dialog_id, offset]).then((queryResult: QueryResult) => {
            let result: IDialog[] = [];

            queryResult.rows.forEach(row => {
                result.push({
                    is_first: row.reply === null,
                    text: row.text,
                    time: row.time,
                    user_name: row.user_id === row.user_id_10 ? row.user_name_10 : row.user_name_20,
                    message_id: row.id
                });
            });

            return result;
        });
    }

    /*
    WITH t1 AS (SELECT user_id FROM sessions WHERE token = 'c504688d-7abe-45d5-9daa-7fc4ce804a59'),
        t2 AS (SELECT array_agg(id) AS ids FROM dialogs WHERE (user_id_1 = (SELECT user_id FROM t1) OR user_id_2 = (SELECT user_id FROM t1))),
        t3 AS (SELECT DISTINCT ON (dialog_id) dialog_id, id, TEXT, TIME, user_id, reply_to FROM messages WHERE dialog_id = ANY (SELECT unnest(ids) FROM t2) ORDER BY dialog_id, TIME DESC)
        SELECT messages.dialog_id AS dialog_id, messages.text AS text_1, messages.time AS time_1, messages.user_id AS user_id_1, t3.text AS text_2, t3.time AS time_2, t3.user_id AS user_id_2,
            dialogs.user_id_1 AS user_id_10, dialogs.user_id_2 AS user_id_20, dialogs.user_name_1 AS user_name_10, dialogs.user_name_2 AS user_name_20
            FROM t3
            JOIN messages ON t3.reply_to = messages.id
            JOIN dialogs ON t3.dialog_id = dialogs.id
            WHERE t3.user_id != (SELECT user_id FROM t1)
            OFFSET 0 LIMIT 10
    * */
    getDialogs(userToken: string, offset: number = 0): Promise<IDialogs[]> {
        const query = 'WITH t1 AS (SELECT user_id FROM sessions WHERE token = $1),\n' +
            't2 AS (SELECT array_agg(id) AS ids FROM dialogs WHERE (user_id_1 = (SELECT user_id FROM t1) OR user_id_2 = (SELECT user_id FROM t1))),\n' +
            't3 AS (SELECT DISTINCT ON (dialog_id) dialog_id, id, TEXT, TIME, user_id, reply_to FROM messages WHERE dialog_id = ANY (SELECT unnest(ids) FROM t2) ORDER BY dialog_id, TIME DESC)\n' +
            'SELECT messages.dialog_id AS dialog_id, messages.text AS text_1, messages.time AS time_1, messages.user_id AS user_id_1, t3.text AS text_2, t3.time AS time_2, t3.user_id AS user_id_2,\n' +
            'dialogs.user_id_1 AS user_id_10, dialogs.user_id_2 AS user_id_20, dialogs.user_name_1 AS user_name_10, dialogs.user_name_2 AS user_name_20\n' +
            'FROM t3 \n' +
            'JOIN messages ON t3.reply_to = messages.id\n' +
            'JOIN dialogs ON t3.dialog_id = dialogs.id\n' +
            'WHERE t3.user_id != (SELECT user_id FROM t1)\n' +
            'OFFSET $2 LIMIT 10';

        return this.query(query, [userToken, offset]).then((queryResult: QueryResult) => {
            let result: IDialogs[] = [];

            queryResult.rows.forEach(row => {
                result.push({
                    dialog_id: row.dialog_id,
                    user_name_1: row.user_id_1 === row.user_id_10 ? row.user_name_10 : row.user_name_20,
                    text_1: row.text_1,
                    time_1: row.time_1,
                    user_name_2: row.user_id_2 === row.user_id_10 ? row.user_name_10 : row.user_name_20,
                    text_2: row.text_2,
                    time_2: row.time_2
                });
            });

            return result;
        });
    }

    getMessage(userToken: string): Promise<Record<string,any> | null> {
        return this.getUserIdByToken(userToken).then((userId:number | null) => {
            if(userId === null) {
                return null;
            } else {
                const query = 'SELECT id, message, user_name FROM flying_messages LEFT JOIN caught_messages ON flying_messages.id = caught_messages.msg_id WHERE flying_messages.user_id != $1 AND (caught_messages.user_id != $1 OR caught_messages.user_id IS NULL) LIMIT 1';

                return this.query(query, [userId]).then((queryResult: QueryResult) => {
                    if(queryResult.rows.length) {
                        const row = queryResult.rows[0],
                            query = 'INSERT INTO caught_messages (user_id, msg_id) VALUES ($1, $2)';

                        return this.query(query, [userId, row.id]).then((queryResult: QueryResult) => {
                            return {
                                hasMessages: true,
                                data: {
                                    msg: row.message,
                                    msg_id: row.id,
                                    name: row.user_name
                                }
                            };
                        });
                    } else {
                        return {
                            hasMessages: false
                        };
                    }
                });
            }
        });
    }

    sendMessage(userToken: string, messageText: string, userName?: string): Promise<boolean> {
        const query = 'WITH t1 AS (SELECT user_id FROM sessions WHERE token = $1)\n' +
            'INSERT INTO flying_messages (id, user_id, message, user_name) VALUES ($2, (SELECT user_id FROM t1), $3, $4)',
            messageId = uuid();

        return this.query(query, [userToken, messageId, messageText, userName || '']).then((queryResult: QueryResult) => {
            return true;
        });
    }
}