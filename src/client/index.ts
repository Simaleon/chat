import Vue from 'vue';
import VueRouter, {RouteConfig} from "vue-router";

import {API} from "@/client/API";

// components
import client from './vue/client.vue';
import mainContainer from './vue/mainContainer.vue';
import login from './vue/login.vue'
import registration from './vue/registration.vue';
import chat from './vue/chat.vue';
import catchMessage from "./vue/catchMessage.vue";
import myDialogs from './vue/myDialogs.vue';
import dialog from "./vue/dialog.vue";
import page_404 from './vue/page_404.vue';
import page_500 from './vue/page_500.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
        {
            path: '/',
            component: mainContainer,
            children: [
                { name: 'root', path: '/', component: chat },
                { name: 'login', path: 'login', component: login },
                { name: 'registration', path: 'registration', component: registration },
                { name: 'catchMessage', path: 'catchMessage', component: catchMessage },
                { name: 'myDialogs', path: 'myDialogs', component: myDialogs },
                { name: 'dialog', path: 'dialog', component: dialog },
                { name: 'page_500', path: '500', component: page_500 }
            ],
        },
        {
            path: '*',
            component: page_404
        }
    ],
    router = new VueRouter({
        mode: 'history',
        routes
    });

const api = new API(router);

let isAuth = false;

Vue.prototype.$api = api;

router.beforeEach((to, from, next) => {
    if(from.name === 'login' || from.name === 'registration') {
        if(to.params.isAuth === 'true') {
            isAuth = true;
        }
    }

    // after logout
    if(to.params.isAuth === 'false') {
        isAuth = false;
    }

    if(to.name === 'login' || to.name === 'registration' || isAuth) {
        next();
    } else {
        console.log('check auth')
        api.checkAuth().then((json) => {
            if(json.success) {
                isAuth = true;

                next();
            } else {
                router.push({ name: 'login' });
            }
        });
    }
});

new Vue({
    el: '#app',
    render: h => h(client),
    router
});