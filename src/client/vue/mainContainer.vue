<template>
    <div class="mainContainer" @click="isProfileOpen = false">
        <header>
            <div class="logo">
                <router-link :to="{ name: 'root' }" class="logoText">re:fly</router-link>
            </div>
            <div class="rightPanel">
                <div class="icons">
<!--                    <div class="icon notifies" title="Уведомления"></div>-->
                    <!--                todo: title Тёмная тема/Светлая тема меняется через скрипт-->
<!--                    <div class="icon theme" title="Тёмная тема"></div>-->
                    <router-link class="icon catch" title="Поймать записку" :to="{ name: 'catchMessage', query: { time: Date.now() } }"></router-link>
                    <router-link class="icon messages" title="Мои записки" :to="{ name: 'myDialogs', query: { time: Date.now() } }"></router-link>
                    <div class="icon profile" title="Профиль" @click="profileIconCLick"></div>
                </div>
                <div class="profileMenu" v-if="isProfileOpen">
                    <div class="exit" @click="logout">Выход</div>
                </div>
            </div>
        </header>
        <router-view class="subContainer"></router-view>
        <footer>
            Онлайн, правила
        </footer>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";

    export default Vue.extend({
        name: "mainContainer",
        data: function () {
            return {
                isProfileOpen: false
            };
        },
        methods: {
            logout() {
                const vueComponent = this;

                this.$api.logout().then((json: Record<string, any>) => {
                    if(json.success) {
                        vueComponent.$router.push({ name: 'login', params: { isAuth: 'false' } });
                    } else {
                        // todo
                    }
                });
            },

            profileIconCLick(evt: MouseEvent) {
                evt.stopPropagation();

                this.isProfileOpen = !this.isProfileOpen;
            }
        }
    });
</script>

<style>
    @font-face {
        font-family: "Caveat";
        src: url("../fonts/Caveat/static/Caveat-Bold.ttf");
    }

    @font-face {
        font-family: "Raleway";
        src: url("../fonts/Raleway/static/Raleway-Regular.ttf");
    }

    @font-face {
        font-family: "Lato";
        src: url("../fonts/Lato/Lato-Regular.ttf");
    }

    * {
        font-family: Raleway, sans-serif;
        font-style: normal;
        font-weight: 600;
        color: #25262A;
    }

    a {
        text-decoration: none;
        color: #25262A;
    }

    html, body {
        height: 100%;
    }

    body {
        font-size: 16px;
        font-family: Raleway, sans-serif;
        font-style: normal;
        font-weight: normal;
    }
</style>

<style scoped>
    .mainContainer {
        display: flex;
        flex-direction: column;
        /*min-height: 100%;*/
        height: 100%;
        background: #7F818D;
    }

    header {
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        align-items: center;
        margin: 0 auto;
        background: #FFFFFF;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    }

    .logoText {
        font-family: Caveat, sans-serif;
        font-style: normal;
        font-weight: bold;
        /*font-size: 48px;*/
        font-size: 1.5em;
        margin-top: -15px;
        user-select: none;

        color: #2B2B2B;

        text-decoration: none;
    }

    .rightPanel {
        position: relative;
        display: flex;
        gap: 40px;
    }

    .rightPanel > .icons {
        display: flex;
        gap: 40px;
    }

    .rightPanel > .icons > .icon {
        width: 30px;
        height: 30px;
        background-position: center;
        background-repeat: no-repeat;
        background-size: 100%;
        cursor: pointer;
    }

    .rightPanel > .icons > .catch {
        background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 122.88 100.7' style='enable-background:new 0 0 122.88 100.7' xml:space='preserve'%3E%3Cg%3E%3Cpath fill='%23B0B0B0' d='M76.74,57.48l-0.11,0.12c-0.52,0.56-1.07,1.13-1.65,1.71l0,0C64.54,69.74,52.02,76.16,40.21,78.1 c-12.04,1.98-23.38-0.68-31.14-8.44C1.31,61.9-1.35,50.57,0.63,38.52c1.94-11.81,8.36-24.33,18.8-34.77l0.11-0.11 c0.54-0.54,1.07-1.05,1.6-1.54c0.63-0.59,1.21-1.12,1.74-1.59c0.82-0.72,2.06-0.68,2.83,0.09l52.42,52.42l44.15,44.15 c0.81,0.81,0.81,2.12,0,2.92c-0.81,0.81-2.12,0.81-2.92,0L76.74,57.48L76.74,57.48z M67.17,60.83l-6.84-0.06l-0.04,5.08 C62.63,64.36,64.93,62.69,67.17,60.83L67.17,60.83z M57.46,67.54l0.06-6.79l-10.55-0.09l-0.09,10.55l2.79,0.02 C52.28,70.22,54.89,68.99,57.46,67.54L57.46,67.54z M39.97,73.96l-3.12-0.03l-7.19,0.06l0,0.49c3.17,0.26,6.49,0.11,9.88-0.45 C39.69,74.01,39.83,73.98,39.97,73.96L39.97,73.96z M26.86,74.13l0-0.11l-0.59,0.01C26.46,74.06,26.66,74.1,26.86,74.13 L26.86,74.13z M13.44,68.08l-0.06-7.31L7.6,60.82c1.16,2.16,2.62,4.15,4.39,5.92C12.46,67.21,12.95,67.65,13.44,68.08L13.44,68.08z M6.3,58.03l7.05-0.06l-0.09-10.55l-9.11,0.08C4.3,51.23,5.01,54.79,6.3,58.03L6.3,58.03z M4.15,44.68l9.09-0.08l-0.05-5.5 c-0.02-0.09-0.03-0.18-0.03-0.28l0.01-1.36l-0.01-1.36c0-0.1,0.01-0.19,0.03-0.28l0.05-5.5l-6.2-0.05 c-1.08,2.99-1.86,5.98-2.34,8.91C4.39,41.04,4.21,42.88,4.15,44.68L4.15,44.68z M8.14,27.47l5.13,0.04l0.08-9.79 C11.27,20.91,9.53,24.18,8.14,27.47L8.14,27.47z M16.19,13.71l0,0.47l10.55,0.09l0.06-6.73l-2.63-2.63l-0.21,0.19 c-0.52,0.49-1.03,0.98-1.51,1.46l-0.1,0.11C20.1,8.93,18.04,11.28,16.19,13.71L16.19,13.71z M29.58,10.32l-0.03,3.97l4.04,0.03 L29.58,10.32L29.58,10.32z M36.43,17.17l-0.75,0.01c-0.09,0-0.18-0.01-0.26-0.02l-5.89-0.05l-0.09,10.55l7.42,0.06l7.42-0.06 l-0.02-2.67L36.43,17.17L36.43,17.17z M49.68,30.42l-2.57,0.02l0.04,4.43c0.03,0.11,0.04,0.23,0.04,0.35l-0.02,2.25l0.02,2.24 c0,0.12-0.01,0.24-0.04,0.35l-0.04,4.43l10.55,0.09l0.05-6.13L49.68,30.42L49.68,30.42z M60.49,41.23l-0.03,3.37l3.43,0.03 L60.49,41.23L60.49,41.23z M66.73,47.47l-6.28-0.05l-0.09,10.55l9.98,0.09c0.19-0.18,0.39-0.37,0.58-0.55l0.05-5.8L66.73,47.47 L66.73,47.47z M73.74,54.48l0,0.16l0.08-0.08L73.74,54.48L73.74,54.48z M44.07,71.19l0.09-10.55l-7.3-0.06l-7.3,0.06l0.09,10.55 l4.82-0.04c0.11-0.03,0.22-0.04,0.34-0.04l2.06,0.02l2.06-0.02c0.12,0,0.23,0.01,0.34,0.04L44.07,71.19L44.07,71.19z M44.18,57.83 l0.09-10.55l-7.42-0.06l-7.42,0.06l0.09,10.55l5.89-0.05c0.09-0.02,0.17-0.02,0.26-0.02l1.17,0.01l1.17-0.01 c0.09,0,0.18,0.01,0.26,0.02L44.18,57.83L44.18,57.83z M44.3,44.47l0.06-7l-0.06-7l-7.01,0.06c-0.05,0-0.09,0.01-0.14,0.01l-0.29,0 l-0.29,0c-0.05,0-0.1,0-0.14-0.01l-7.01-0.06l-0.06,7l0.06,7l7.01-0.06c0.05,0,0.1-0.01,0.14-0.01l0.29,0l0.29,0 c0.05,0,0.1,0,0.14,0.01L44.3,44.47L44.3,44.47z M47.08,47.3l-0.09,10.55l10.55,0.09l0.09-10.55L47.08,47.3L47.08,47.3z M26.56,40.06c-0.03-0.11-0.04-0.23-0.04-0.35l0.02-2.24l-0.02-2.25c0-0.12,0.01-0.24,0.04-0.35l0.04-4.43l-10.55-0.09l-0.06,7.12 l0.06,7.12l10.55-0.09L26.56,40.06L26.56,40.06z M26.63,47.3l-10.55,0.09l0.09,10.55l10.55-0.09L26.63,47.3L26.63,47.3z M26.74,60.66l-10.55,0.09l0.08,9.42c0.63,0.4,1.27,0.77,1.94,1.12l8.63-0.07L26.74,60.66L26.74,60.66z M26.72,17.08l-10.55-0.09 l-0.09,10.55l10.55,0.09L26.72,17.08L26.72,17.08z'/%3E%3C/g%3E%3C/svg%3E");
    }

    .rightPanel > .icons > .messages {
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23B0B0B0' d='M14.25 3H3.75C3.15326 3 2.58097 3.23705 2.15901 3.65901C1.73705 4.08097 1.5 4.65326 1.5 5.25V12.75C1.5 13.3467 1.73705 13.919 2.15901 14.341C2.58097 14.7629 3.15326 15 3.75 15H14.25C14.8467 15 15.419 14.7629 15.841 14.341C16.2629 13.919 16.5 13.3467 16.5 12.75V5.25C16.5 4.65326 16.2629 4.08097 15.841 3.65901C15.419 3.23705 14.8467 3 14.25 3ZM13.9425 4.5L9.5325 8.91C9.46278 8.9803 9.37983 9.03609 9.28843 9.07417C9.19704 9.11225 9.09901 9.13185 9 9.13185C8.90099 9.13185 8.80296 9.11225 8.71157 9.07417C8.62017 9.03609 8.53722 8.9803 8.4675 8.91L4.0575 4.5H13.9425ZM15 12.75C15 12.9489 14.921 13.1397 14.7803 13.2803C14.6397 13.421 14.4489 13.5 14.25 13.5H3.75C3.55109 13.5 3.36032 13.421 3.21967 13.2803C3.07902 13.1397 3 12.9489 3 12.75V5.5575L7.41 9.9675C7.83188 10.3889 8.40375 10.6255 9 10.6255C9.59625 10.6255 10.1681 10.3889 10.59 9.9675L15 5.5575V12.75Z' /%3E%3C/svg%3E%0A");
    }

    .rightPanel > .icons > .profile {
        background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15.71 12.7099C16.6904 11.9385 17.406 10.8808 17.7572 9.68382C18.1085 8.48684 18.0779 7.21015 17.6698 6.03135C17.2617 4.85255 16.4963 3.83027 15.4801 3.10674C14.4639 2.3832 13.2474 1.99438 12 1.99438C10.7525 1.99438 9.53611 2.3832 8.51993 3.10674C7.50374 3.83027 6.73834 4.85255 6.33021 6.03135C5.92208 7.21015 5.89151 8.48684 6.24276 9.68382C6.59401 10.8808 7.3096 11.9385 8.29 12.7099C6.61007 13.3829 5.14428 14.4992 4.04889 15.9398C2.95349 17.3804 2.26956 19.0912 2.07 20.8899C2.05555 21.0212 2.06711 21.1541 2.10402 21.2809C2.14093 21.4078 2.20246 21.5261 2.28511 21.6292C2.45202 21.8374 2.69478 21.9707 2.96 21.9999C3.22521 22.0291 3.49116 21.9517 3.69932 21.7848C3.90749 21.6179 4.04082 21.3751 4.07 21.1099C4.28958 19.1551 5.22168 17.3497 6.68822 16.0387C8.15475 14.7277 10.0529 14.0029 12.02 14.0029C13.9871 14.0029 15.8852 14.7277 17.3518 16.0387C18.8183 17.3497 19.7504 19.1551 19.97 21.1099C19.9972 21.3556 20.1144 21.5825 20.2991 21.7469C20.4838 21.9113 20.7228 22.0014 20.97 21.9999H21.08C21.3421 21.9697 21.5817 21.8372 21.7466 21.6311C21.9114 21.4251 21.9881 21.1622 21.96 20.8999C21.7595 19.0961 21.0719 17.3809 19.9708 15.9381C18.8698 14.4953 17.3969 13.3794 15.71 12.7099ZM12 11.9999C11.2089 11.9999 10.4355 11.7653 9.77772 11.3258C9.11992 10.8862 8.60723 10.2615 8.30448 9.53061C8.00173 8.79971 7.92251 7.99544 8.07686 7.21952C8.2312 6.4436 8.61216 5.73086 9.17157 5.17145C9.73098 4.61204 10.4437 4.23108 11.2196 4.07674C11.9956 3.9224 12.7998 4.00161 13.5307 4.30436C14.2616 4.60711 14.8863 5.1198 15.3259 5.7776C15.7654 6.4354 16 7.20876 16 7.99988C16 9.06075 15.5786 10.0782 14.8284 10.8283C14.0783 11.5785 13.0609 11.9999 12 11.9999Z' fill='%23B0B0B0'/%3E%3C/svg%3E%0A");
    }

    .rightPanel > .profileMenu {
        position: absolute;
        right: 0;
        top: 35px;
        background: #FFFFFF;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        border-radius: 6px;
        padding: 15px;
    }

    .rightPanel > .profileMenu > * {
        cursor: pointer;
    }

    .subContainer {
        padding-top: 20px;
    }

    footer {
        height: 50px;
        /* https://stackoverflow.com/a/20352949/16501014 */
        margin-top: auto;
        text-align: center;
    }

    /* mobile */
    @media only screen and (max-width: 600px) {
        header {
            width: 100%;
            height: 50px;
            padding: 0 15px;
        }

        .rightPanel > .icons {
            gap: 20px;
        }

        .subContainer {
            width: 100%;
            padding: 20px;
        }
    }

    /* pc */
    @media only screen and (min-width: 601px) {
        .mainContainer {
            padding-top: 32px;
        }

        header {
            width: 80%;
            height: 100px;
            padding: 0 40px;
        }

        .rightPanel > .icons {
            gap: 40px;
        }

        .subContainer {
            width: 80%;
            margin: 0 auto;
        }
    }
</style>