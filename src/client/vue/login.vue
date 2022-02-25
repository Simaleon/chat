<template>
    <div class="login">
        <div class="login-box">
            <div class="login-body">
                <div class="inputBox">
                    <input type="text" placeholder="Логин" id="login" v-model="login">
                    <div class="inputBox-iconBox">
                        <div class="icon login"></div>
                    </div>
                </div>
                <div class="inputBox">
                    <input type="password" placeholder="Пароль" id="password" v-model="password">
                    <div class="inputBox-iconBox">
                        <div class="icon password"></div>
                    </div>
                </div>
                <div class="btnBox">
                    <div class="rememberMeBox">
                        <input type="checkbox" id="is_remember" v-model="is_remember">
                        <label for="is_remember">Запомнить меня</label>
                    </div>
                    <div class="loginBtnBox">
                        <button id="loginBtn" @click="loginMethod">Войти</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";

    export default Vue.extend({
        name: "login",
        data: function () {
            return {
                login: '',
                password: '',
                is_remember: false
            }
        },
        methods: {
            loginMethod: function () {
                const vueComponent = this;
                // todo: loading animation

                this.$api.login(this.login, this.password, this.is_remember).then((json: Record<string, any>) => {
                    if(json.success) {
                        vueComponent.$router.push({ name: 'root', params: { isAuth: 'true' } });
                    } else {
                        // todo
                    }
                });
            }
        }
    });
</script>

<style scoped>
    @font-face {
        font-family: "Source Sans Pro";
        src: url("../fonts/Source_Sans_Pro/SourceSansPro-Regular.ttf");
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .login {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-family: "Source Sans Pro",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        color: #212529;
    }

    .login-box {
        width: 360px;
        border-top: 3px solid #007bff;
        background-color: white;
        box-shadow: rgba(0, 0, 0, 0.125) 0px 0px 1px 0px, rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, 0 0 1px rgba(0,0,0,.125), 0 1px 3px rgba(0,0,0,.2)
    }

    .login-header {
        background-color: transparent;
        border-bottom: 1px solid rgba(0,0,0,.125);
        padding: .75rem 1.25rem;
        position: relative;
        border-top-left-radius: .25rem;
        border-top-right-radius: .25rem;
        text-align: center;
    }

    .login-body {
        padding: 20px;
    }

    .inputBox {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        align-items: stretch;
        width: 300px;
        margin: 0 auto 20px auto;
    }

    .inputBox > input {
        flex: 1;
        height: calc(2.25rem + 2px);
        padding: .375rem .75rem;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        color: #495057;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid #ced4da;
        border-radius: .25rem 0 0 .25rem;
        box-shadow: inset 0 0 0 transparent;
        transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    }

    .inputBox > input:focus {
        color: #495057;
        background-color: #fff;
        border-color: #80bdff;
        outline: 0;
        box-shadow: inset 0 0 0 transparent;
    }

    .inputBox-iconBox {
        width: 42px;
        height: 38px;
        padding: .375rem .75rem;
        margin-bottom: 0;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        color: #495057;
        text-align: center;
        white-space: nowrap;
        background-color: #e9ecef;
        border: 1px solid #ced4da;
        border-left: 0;
        border-radius: 0 .25rem .25rem 0;
    }

    .icon {
        width: 100%;
        height: 100%;
        background-position: center;
        background-repeat: no-repeat;
    }

    .icon.login {
        background-image: url("data:image/svg+xml,%3Csvg role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3E%3Cpath d='M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z'%3E%3C/path%3E%3C/svg%3E");
    }

    .icon.password {
        background-image: url("data:image/svg+xml,%3Csvg role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3E%3Cpath d='M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zm-104 0H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z'%3E%3C/path%3E%3C/svg%3E");
    }

    .btnBox {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        width: 300px;
        margin: 0 auto;
    }

    .rememberMeBox > input {
        position: absolute;
        opacity: 0;
    }

    .rememberMeBox > label {
        font-weight: 700;
        padding-left: 29px!important;
        min-height: 22px;
        line-height: 22px;
        display: inline-block;
        position: relative;
        vertical-align: top;
        margin-bottom: 0;
        cursor: pointer;
        user-select: none;
    }

    .rememberMeBox > label:before {
        content: "";
        display: inline-block;
        position: absolute;
        width: 22px;
        height: 22px;
        border: 1px solid #D3CFC8;
        border-radius: 0;
        margin-left: -29px;
    }

    .rememberMeBox > label:hover:before {
        border-width: 2px;
        border-color: #2e6da4;
    }

    .rememberMeBox > input:checked + label:before {
        background-color: #007bff;
        border-color: #007bff;
    }

    .rememberMeBox > input:checked + label:after {
        content: "";
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        width: 7px;
        height: 10px;
        border: 2px solid #fff;
        border-left: none;
        border-top: none;
        transform: translate(7.75px,4.5px) rotate(45deg);
    }

    .loginBtnBox > button {
        font-weight: 400;
        color: #fff;
        background-color: #007bff;
        border-color: #007bff;
        border-style: solid;
        border-width: 1px;
        text-align: center;
        vertical-align: middle;
        user-select: none;
        padding: .375rem .75rem;
        font-size: 1rem;
        line-height: 1.5;
        border-radius: .25rem;
        cursor: pointer;
        transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    }

    .loginBtnBox > button:hover {
        background-color: #0069d9;
        border-color: #0062cc;
    }
</style>