<template>
    <div class="loginPanel">
        <div class="loginForm">
            <span class="loginLabel">Регистрация</span>

            <div class="inputWrap">
                <span class="inputLabel">Login</span>
                <input type="text" placeholder="Введите логин" v-model="login" @change="userAlreadyExist = false">
                <span class="inputFocus"></span>
            </div>

            <div class="inputWrap">
                <span class="inputLabel">Пароль</span>
                <input type="password" placeholder="Введите пароль" v-model="password">
                <span class="inputFocus"></span>
            </div>

            <div class="userAlreadyExist" v-if="userAlreadyExist">
                Пользователь с таким email уже зарегистрирован
            </div>

            <button class="loginButton" @click="register">Зарегистрироваться</button>

            <div class="link registration">
                <router-link to="/login">Вход</router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";

    export default Vue.extend({
        name: "registration",
        data: function () {
            return {
                login: '',
                password: '',
                userAlreadyExist: false
            }
        },
        methods: {
            register: function () {
                const vueComponent = this;
                // todo: loading animation
                this.$api.register(this.login, this.password).then((json: Record<string, any>) => {
                    if(json.registration) {
                        // todo: complete animation
                        vueComponent.$router.push('chat');
                    } else {
                        this.userAlreadyExist = true;
                    }
                }).catch(() => {
                    // todo: error label
                });
            }
        }
    });
</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap');
    /*
    @font-face {
        font-family: Poppins-Regular;
        src: url(/static/fonts/Poppins/Poppins-Regular.ttf);
    }
    */
    /* pc */
    @media (pointer: fine) {
        .loginForm {
            width: 500px;
        }

        .loginLabel {
            font-size: 3rem;
        }

        .inputLabel {
            font-size: 1.5rem;
        }

        .inputWrap > input {
            font-size: 16px;
            height: 55px;
        }

        .link > a {
            font-size: 14px;
        }

        .loginButton {
            margin-top: 30px;
            font-size: 16px;
            height: 50px;
        }
    }
    /* touchscreens */
    @media (pointer: coarse) {
        .loginForm {
            width: 90%;
            border: none;
        }

        .loginLabel {
            font-size: 6rem;
        }

        .inputLabel {
            font-size: 2.5rem;
        }

        .inputWrap > input {
            font-size: 3.5rem;
            height: 6rem;
        }

        .link > a {
            font-size: 2.5rem;
        }

        .loginButton {
            height: 6rem;
            margin-top: 4rem;
            font-size: 2.2rem;
        }
    }

    .loginPanel {
        width: 100%;
        margin-top: 50px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
    }

    .loginForm {
        background: #fff;
        border-radius: 10px;
        border: 1px solid #d8d8d8;
        overflow: hidden;
        padding: 50px;
        font-family: 'Oswald', sans-serif;
    }

    .loginLabel {
        display: block;
        color: #333;
        text-align: center;
        font-weight: 700;
        padding-bottom: 50px;
    }

    .inputWrap {
        width: 100%;
        position: relative;
        border-bottom: 2px solid #d9d9d9;
        margin-bottom: 23px;
    }

    .inputWrap > input {
        outline: none;
        border: none;
        color: #333;
        display: block;
        width: 100%;
        background: 0 0;
        padding: 0 7px 0 43px;
    }

    .inputWrap > input:focus::placeholder {
        color: transparent;
    }

    .inputFocus {
        position: absolute;
        display: block;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        pointer-events: none;
    }

    .inputFocus:before {
        content: "";
        display: block;
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 0;
        height: 2px;
        background: #7f7f7f;
        -webkit-transition: all .4s;
        -o-transition: all .4s;
        -moz-transition: all .4s;
        transition: all .4s;
    }

    .inputWrap > input:focus + .inputFocus:before {
        width: 100%
    }

    .inputWrap > input:focus + .inputFocus:after {
        color: #a64bf4
    }

    .link {
        text-align: right;
    }

    .link > a {
        color: #666;
    }

    .link > a:hover {
        text-decoration: none;
        color: #a64bf4
    }

    .userAlreadyExist {
        color: #fc3a3a;
        text-align: center;
    }

    .loginButton {
        width: 100%;
        border-radius: 25px;
        overflow: hidden;
        box-shadow: 0 5px 30px 0 rgba(3,216,222,.2);
        outline: none;
        border: none;
        background: -webkit-linear-gradient(right,#00dbde,#fc00ff);
        color: #fff;
        text-transform: uppercase;
        padding: 0 20px;
    }

    .registration {
        margin-top: 40px;
    }
</style>