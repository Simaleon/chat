import express, {Router} from "express";
import {IDatabase} from "@/server/_interfaces/IDatabase";

export class BaseRouter {
    private readonly _router: Router;

    constructor(dbAdapter: IDatabase) {
        this._router = express.Router();
    }

    getRouter(): Router {
        return this._router;
    }
}