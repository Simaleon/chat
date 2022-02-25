import {BaseRouter} from "@/server/routers/BaseRouter";
import {IDatabase} from "@/server/_interfaces/IDatabase";
import {Messages} from "@/server/postgres/Messages";
import express from "express";

export class MessagesRouter extends BaseRouter {
    constructor(dbAdapter: IDatabase) {
        super(dbAdapter);

        const router = this.getRouter(),
            messages = new Messages(dbAdapter);

        router.post('/answerMessage', (request: express.Request, response: express.Response, next: express.NextFunction) => {
            try {
                messages.answerMessage(request.cookies.authToken, request.body.message_id, request.body.message_text).then((result) => {
                    if (result) {
                        response.json({
                            success: true
                        });
                    } else {
                        response.json({
                            success: false
                        });
                    }
                }).catch((e:  Error) => {
                    next(e);
                });
            } catch (e) {
                next(e);
            }
        });

        router.post('/createDialog', (request: express.Request, response: express.Response, next: express.NextFunction) => {
            try {
                messages.createDialog(request.cookies.authToken, request.body.message_id, request.body.message_text, request.body.name).then((result) => {
                    if (result) {
                        response.json({
                            success: true
                        });
                    } else {
                        response.json({
                            success: false
                        });
                    }
                }).catch((e:  Error) => {
                    next(e);
                });
            } catch (e) {
                next(e);
            }
        });

        router.get('/getMessage', (request: express.Request, response: express.Response, next: express.NextFunction) => {
            try {
                messages.getMessage(request.cookies.authToken).then((result) => {
                    result.success = true;

                    response.json(result);
                }).catch((e:  Error) => {
                    next(e);
                });
            } catch (e) {
                next(e);
            }
        });

        router.get('/getDialog', (request: express.Request, response: express.Response, next: express.NextFunction) => {
            try {
                const dialog_id = Number(request.query.dialog_id),
                    offset = Number(request.query.offset);

                messages.getDialog(request.cookies.authToken, dialog_id, isNaN(offset) ? 0 : offset).then((result) => {
                    response.json({
                        success: true,
                        data: result
                    });
                }).catch((e:  Error) => {
                    next(e);
                });
            } catch (e) {
                next(e);
            }
        });

        router.get('/getDialogs', (request: express.Request, response: express.Response, next: express.NextFunction) => {
            try {
                const offset = Number(request.query.offset);

                messages.getDialogs(request.cookies.authToken, isNaN(offset) ? 0 : offset).then((result) => {
                    response.json({
                        success: true,
                        data: result
                    });
                }).catch((e:  Error) => {
                    next(e);
                });
            } catch (e) {
                next(e);
            }
        });

        router.post('/sendMessage', (request: express.Request, response: express.Response, next: express.NextFunction) => {
            try {
                messages.sendMessage(request.cookies.authToken, request.body.message, request.body.name).then((result:boolean) => {
                    if(result) {
                        response.json({
                            success: true
                        });
                    } else {
                        response.json({
                            success: false
                        });
                    }
                }).catch((e: Error) => {
                    response.json({
                        success: false
                    });
                });
            } catch (e) {
                next(e);
            }
        });
    }
}