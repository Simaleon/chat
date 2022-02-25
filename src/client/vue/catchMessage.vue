<template>
    <div class="catchMessage">
        <div class="message" v-if="hasMessages">
            <div class="messageText" >{{message}}</div>
        </div>
        <write-message v-if="hasMessages" :sendMessageMethod="answer" :button-text="'Ответить'"></write-message>
        <div class="noMessages" v-if="!hasMessages">
            <div class="text">Сообщений нет</div>
            <find-new-buttons></find-new-buttons>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import writeMessage from './components/writeMessage.vue';
    import findNewButtons from './components/findNewButtons.vue';
    import {NavigationGuardNext, Route} from "vue-router";

    export default Vue.extend({
        name: "catchMessage",
        components: {
            writeMessage,
            findNewButtons
        },
        data: function() {
            return {
                hasMessages: false,
                message: '',
                message_id: '',
                authorName: ''
            }
        },
        methods: {
            answer(message: string, name?: string) {
                return this.$api.createDialog.call(this, this.message_id, message, name);
            },
            getMessage(next: NavigationGuardNext) {
                this.$api.getMessage().then((json: Record<string, any>) => {
                    if(json.success) {
                        this.hasMessages = json.hasMessages;

                        if(json.hasMessages) {
                            this.message = json.data.msg;
                            this.message_id = json.data.msg_id;
                            this.authorName = json.data.name;
                        } else {
                            this.message = '';
                            this.message_id = '';
                            this.authorName = '';
                        }

                        next();
                    } else {
                        // todo
                        next();
                    }
                });
            }
        },
        beforeRouteEnter(to: Route, from: Route, next: NavigationGuardNext) {
            next((component: any) => {
                component.getMessage(next);
            });
        },
        beforeRouteUpdate(to: Route, from: Route, next: NavigationGuardNext) {
            this.getMessage(next);
        }
    });
</script>

<style scoped>
    .catchMessage {
        width: 45%;
    }

    .message {
        background: #FFFFFF;
        border-radius: 10px;
        padding: 34px 32px;
        margin-bottom: 20px;
    }

    .message > .messageText {
        font-family: Lato, sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 20px;
        color: #2B2B2B;
    }

    .noMessages {
        background: #FFFFFF;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        border-radius: 6px;
        padding: 20px;
        text-align: center;
    }
</style>