import {VueRouter} from "vue-router/types/router";

// возвращает куки с указанным name,
// или undefined, если ничего не найдено
function getCookie(name: string) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

enum HTTPMethods { GET = 'GET', POST = 'POST'}

export class API {
    private readonly _router: VueRouter;

    constructor(router: VueRouter) {
        this._router = router;
    }

    private getRouter() {
        return this._router;
    }

    private fetch(url: string, method: HTTPMethods, params?: Record<string, any>): Promise<Record<string, any>> {
        url = window.location.origin + url;

        let fetchPromise;

        switch (method) {
            case HTTPMethods.GET:
                if(params) {
                    const Url = new URL(url);

                    let stringifyedParams: Record<string, any> = {};

                    for(let i in params) {
                        switch (typeof params[i]) {
                            case 'undefined':
                            case 'object':
                                break;
                            case 'string':
                                stringifyedParams[i] = params[i];
                                break;
                            default:
                                stringifyedParams[i] = params[i].toString();
                        }
                    }

                    Url.search = new URLSearchParams(params).toString();

                    fetchPromise = fetch(Url.toString(), {
                        method: 'GET',
                        mode: "same-origin"
                    });
                } else {
                    fetchPromise = fetch(url, {
                        method: 'GET',
                        mode: "same-origin"
                    });
                }
                break;
            case HTTPMethods.POST:
                fetchPromise = fetch(url, {
                    method: 'POST',
                    mode: "same-origin",
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify(params)
                });
                break;
            default:
                throw new Error('Undefined HTTP method');
        }

        return fetchPromise.then((response: Response) => {
            if(response.ok) {
                return response.json().catch((e: Error) => {
                    // todo: parsing json error
                    console.log(e);
                    debugger
                });
            } else {
                if(response.status === 401) {
                    this.getRouter().push({name: 'login'});
                }

                if(response.status === 500) {
                    this.getRouter().push({name: 'page_500'});
                }

                return Promise.reject(response);
            }
        });
    }

    // auth
    checkAuth() {
        return this.fetch('/api/auth/check', HTTPMethods.GET);
    }

    login(login: string, password: string, isRemember: boolean): Promise<Record<string, any>> {
        return this.fetch('/api/auth/login', HTTPMethods.POST, {login, password, isRemember});
    }

    logout(): Promise<Record<string, any>> {
        return this.fetch('/api/auth/logout', HTTPMethods.GET);
    }

    register(login: string, password: string): Promise<Record<string, any>> {
        return this.fetch('/api/auth/register', HTTPMethods.POST, {login, password});
    }

    // messages
    answerMessage(message_id: string, message_text: string) {
        return this.fetch('/api/messages/answerMessage', HTTPMethods.POST, {message_id, message_text});
    }

    createDialog(message_id: string, message_text: string, name?: string): Promise<Record<string, any>> {
        return this.fetch('/api/messages/createDialog', HTTPMethods.POST, {message_id, message_text, name});
    }

    getMessage(): Promise<Record<string, any>> {
        return this.fetch('/api/messages/getMessage', HTTPMethods.GET);
    }

    getDialog(dialog_id: number, offset: number = 0) {
        return this.fetch('/api/messages/getDialog', HTTPMethods.GET, { dialog_id, offset }).then((json: Record<string, any>) => {
            if(json.success && json.data.length) {
                json.data.forEach((row: Record<string,any>) => {
                    row.time = new Date(row.time);
                });
            }

            return json;
        });
    }

    getDialogs(offset: number): Promise<Record<string, any>> {
        return this.fetch('/api/messages/getDialogs', HTTPMethods.GET, { offset }).then((json: Record<string, any>) => {
            if(json.success && json.data.length) {
                json.data.forEach((row: Record<string,any>) => {
                    row.time_1 = new Date(row.time_1);
                    row.time_2 = new Date(row.time_2);
                });
            }

            return json;
        });
    }

    sendMessage(message: string, name?: string) {
        return this.fetch('/api/messages/sendMessage', HTTPMethods.POST, { message, name });
    }
}