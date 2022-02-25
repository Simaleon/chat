import express from "express";
import {BaseRouter} from "@/server/routers/BaseRouter";
import {AuthRouter} from "@/server/routers/AuthRouter";
import {MessagesRouter} from "@/server/routers/MessagesRouter";
import {IDatabase} from "@/server/_interfaces/IDatabase";

export class APIRouter extends BaseRouter {
    constructor(dbAdapter: IDatabase) {
        super(dbAdapter);

        const router = this.getRouter();

        router.use(express.json());

        router.use(new AuthRouter(dbAdapter).getRouter());

        router.use('/messages', new MessagesRouter(dbAdapter).getRouter());
    }
}