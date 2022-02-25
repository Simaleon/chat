import express from "express";
import cookieParser from 'cookie-parser';
import argon from "argon2";
import {v4 as uuid} from "uuid";
import {BaseRouter} from "@/server/routers/BaseRouter";
import {IDatabase} from "@/server/_interfaces/IDatabase";

import {Auth} from "@/server/postgres/Auth";

const TOKEN_EXPIRATION = 30;   // 30 days

export class AuthRouter extends BaseRouter {
    private readonly _auth: Auth;

    constructor(dbAdapter: IDatabase) {
        super(dbAdapter);

        const router = this.getRouter();

        this._auth = new Auth(dbAdapter);

        router.post('/auth/login', (request: express.Request, response: express.Response, next: express.NextFunction) => {
            try {
                this._auth.getCredentialByLogin(request.body.login).then(async (credential) => {
                    if(credential && await argon.verify(credential.hash, request.body.password)) {
                        const token = uuid();

                        let date = new Date();
                        date.setDate(date.getDate() + TOKEN_EXPIRATION);

                        this._auth.login(credential.id, token, date, !request.body.isRemember).then(isLoggedIn => {
                            if(isLoggedIn) {
                                response.cookie('authToken', token, {
                                    expires: request.body.isRemember ? date : undefined,
                                    httpOnly: true,
                                    secure: $IS_PRODUCTION,
                                    sameSite: true
                                });

                                response.cookie('login', request.body.login, {
                                    expires: request.body.isRemember ? date : undefined,
                                    secure: $IS_PRODUCTION,
                                    sameSite: true
                                });

                                response.json({
                                    success: true
                                });
                            } else {
                                response.json({
                                    success: false
                                });
                            }
                        });
                    }
                }).catch((e:  Error) => {
                    next(e);
                });
            } catch (e) {
                next(e);
            }
        });

        router.post('/auth/register', async (request: express.Request, response: express.Response, next: express.NextFunction) => {
            try {
                const hash = await argon.hash(request.body.password);

                this._auth.registerByEmail(request.body.login, hash).then((id) => {
                    if(id) {
                        const token = uuid();

                        let date = new Date();
                        date.setDate(date.getDate() + TOKEN_EXPIRATION);

                        this._auth.login(id, token, date, false).then(isLoggedIn => {
                            if(isLoggedIn) {
                                response.cookie('authToken', token, {
                                    expires: request.body.isRemember ? date : undefined,
                                    httpOnly: true,
                                    secure: $IS_PRODUCTION,
                                    sameSite: true
                                });

                                response.cookie('login', request.body.login, {
                                    expires: request.body.isRemember ? date : undefined,
                                    secure: $IS_PRODUCTION,
                                    sameSite: true
                                });

                                response.redirect('/');
                            } else {
                                response.json({
                                    registration: true,
                                    auth: false
                                });
                            }
                        });
                    } else {
                        response.json({
                            registration: false,
                            userAlreadyExist: true
                        });
                    }
                }).catch((e:  Error) => {
                    next(e);
                });
            } catch (e) {
                next(e);
            }
        });

        router.use(cookieParser());

        router.get('/auth/logout', async (request: express.Request, response: express.Response, next: express.NextFunction) => {
            try {
                this._auth.logout(request.cookies.authToken).then((result: boolean) => {
                    response.clearCookie('authToken');
                    response.clearCookie('login');

                    response.json({
                        success: true
                    });
                }).catch((e:  Error) => {
                    next(e);
                });
            } catch (e) {
                next(e);
            }
        });

        // check auth
        router.use((request: express.Request, response: express.Response, next: express.NextFunction) => {
            try {
                this.checkToken(request.cookies.authToken).then((result: boolean) => {
                    if(result) {
                        next();
                    } else {
                        response.clearCookie('authToken');
                        response.clearCookie('login');

                        response.sendStatus(401);
                    }
                }).catch((e:  Error) => {
                    next(e);
                });
            } catch (e) {
                next(e);
            }
        });

        router.get('/auth/check', async (request: express.Request, response: express.Response, next: express.NextFunction) => {
            try {
                this.checkAuth(request, response, (e: Error) => {
                    if(e) {
                        next(e);
                    } else {
                        response.json({
                            success: true
                        });
                    }
                });
            } catch (e) {
                next(e);
            }
        });
    }

    checkAuth(request: express.Request, response: express.Response, next: Function) {
        try {
            const cookies: Record<string, any> = cookieParser.JSONCookies(request.cookies || {});

            this.checkToken(cookies.authToken).then((result: boolean) => {
                if(result) {
                    // todo: update cookies expires
                    /*
                    response.cookie('authToken', token, {
                        expires: date,
                        httpOnly: true,
                        secure: $IS_PRODUCTION,
                        sameSite: true
                    });

                    response.cookie('login', request.body.login, {
                        expires: date,
                        secure: $IS_PRODUCTION,
                        sameSite: true
                    });
                    */
                    next();
                } else {
                    response.clearCookie('authToken');
                    response.clearCookie('login');

                    response.sendStatus(401);
                }
            }).catch((e:  Error) => {
                next(e);
            });
        } catch (e) {
            next(e);
        }
    }

    checkToken(authToken: string): Promise<boolean> {
        let date = new Date();

        date.setDate(date.getDate() + TOKEN_EXPIRATION);

        return this._auth.prolongToken(authToken, date);
    }
}