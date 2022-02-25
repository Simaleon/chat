import express from "express";
import {APIRouter} from "@/server/routers/APIRouter";
import {IDatabase} from "@/server/_interfaces/IDatabase";
import {IServerConfig} from "@/server/_interfaces/IConfigs";
import * as path from "path";
import {AuthRouter} from "@/server/routers/AuthRouter";
import {MessagesRouter} from "@/server/routers/MessagesRouter";

export class Server {
    private _app: express.Application;

    constructor(dbAdapter: IDatabase, config: IServerConfig) {
        this._app = express();

        this._app.use('/scripts', express.static(path.join(__dirname , '../client/scripts')));

        this._app.use('/fonts', express.static(path.join(__dirname , '../client/fonts')));

        this._app.use('/images', express.static(path.join(__dirname , '../client/images')));

        // todo: add welcome page without auth ?

        this._app.use('/api', new APIRouter(dbAdapter).getRouter());

        this._app.get(['/', '/*'], function(request: express.Request, response: express.Response, next: express.NextFunction) {
            response.sendFile(path.join(__dirname , '../client/index.html'));
        });

        this._app.use((error: Error, request: express.Request, response: express.Response, next: express.NextFunction) => {
            // todo: error handler

            console.log(error);

            response.status(500);
        });

        this._app.listen(config.port, () => {
            console.log('Server is listening...');
        });
    }
}