<template>
    <div class="writeMessage">
        <div class="messageBox" v-if="status !== Status.success">
            <input class="name" placeholder="Ваше имя?" v-if="hasNameInput" v-model="name">
            <textarea class="message" placeholder="Что хотите написать?" v-model="message"></textarea>
            <button class="send" @click="sendMessage">{{buttonText}}</button>
        </div>
        <div class="successSend" v-if="status === Status.success">
            <router-link class="writeNew" :to="{ name: 'root' }">Написать записку</router-link>
            <router-link class="myDialogs" :to="{ name: 'myDialogs' }">Мои записки</router-link>
        </div>
        <div class="failedSend" v-if="status === Status.failed">Ошибка при отправке. Попробуйте ещё раз.</div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";

    enum Status { success, failed, none }

    export default  Vue.extend({
        name: "writeMessage",
        props: {
            hasNameInput: {
                type: Boolean,
                default: true
            },
            sendMessageMethod: {
                type: Function,
                required: true
            },
            buttonText: {
                type: String,
                default: 'Отправить'
            }
        },
        data() {
            return {
                Status,
                name: '',
                message: '',
                status: Status.none
            };
        },
        methods: {
            sendMessage() {
                this.sendMessageMethod.call(this, this.message, this.name).then((json: Record<string, any>) => {
                    if(json.success) {
                        this.status = Status.success;
                    } else {
                        this.status = Status.failed;
                    }
                });
            }
        }
    });
</script>

<style scoped>
    .writeMessage {
        display: flex;
        flex-direction: column;
        background: #FFFFFF;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    }

    .writeMessage > .messageBox {
        display: flex;
        flex-direction: column;
    }

    .writeMessage > .messageBox > input,
    .writeMessage > .messageBox > textarea {
        border: 1px solid #C4C4C4;
        padding: 13px 17px;
        font-size: 18px;
        line-height: 24px;
        font-family: Lato, sans-serif;
        font-style: normal;
        font-weight: normal;
        color: #2B2B2B;
    }

    .writeMessage > .messageBox > input {
        height: 50px;
    }

    .writeMessage > .messageBox > textarea {
        height: 100px;
        resize: none;
    }

    .writeMessage > .messageBox > input::placeholder,
    .writeMessage > .messageBox > textarea::placeholder {
        color: #9A9A9A;
    }

    .writeMessage > .messageBox > .send {
        height: 50px;
        background: #222222;
        color: white;
        cursor: pointer;
    }

    .successSend > * {
        display: block;
        margin: 0 auto;
        width: 200px;
        text-align: center;
    }

    .successSend > .writeNew {
        background: #222222;
        border-radius: 6px;
        color: white;
        padding: 10px;
        margin-bottom: 16px;
    }

    .successSend > .myDialogs {
        color: #9A9A9A;
    }

    .writeMessage > .failedSend {
        color: red;
    }

    /* mobile */
    @media only screen and (max-width: 600px) {
        .writeMessage,
        .writeMessage > .messageBox > input,
        .writeMessage > .messageBox > textarea,
        .writeMessage > .messageBox > .send {
            border-radius: 6px;
        }

        .writeMessage {
            padding: 10px;
        }

        .writeMessage > .messageBox > input,
        .writeMessage > .messageBox > textarea {
            margin-bottom: 10px;
        }
    }

    /* pc */
    @media only screen and (min-width: 601px) {
        .writeMessage,
        .writeMessage > .messageBox > input,
        .writeMessage > .messageBox > textarea,
        .writeMessage > .messageBox > .send {
            border-radius: 10px;
        }

        .writeMessage {
            padding: 40px 32px;
        }

        .writeMessage > .messageBox > input,
        .writeMessage > .messageBox > textarea {
            margin-bottom: 30px;
        }
    }
</style>