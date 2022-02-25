<template>
    <div class="dialog">
        <div class="messagesBox">
            <message v-for="message in messages" :user-name="message.user_name" :time="message.time" :text="message.text"></message>
        </div>
        <write-message :hasNameInput="false" :sendMessageMethod="answer" :button-text="'Ответить'"></write-message>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import message from './components/message.vue';
    import writeMessage from './components/writeMessage.vue';
    import {NavigationGuardNext, Route} from "vue-router";

    export default Vue.extend({
        name: "fullDialog",
        components: {
            message,
            writeMessage
        },
        data() {
            return {
                dialog_id: null,
                isAllLoaded: false,
                isLoading: false,
                messages: []
            };
        },
        mounted () {
            this.$el.querySelector('.messagesBox').addEventListener('scroll', this.handleScroll);
            console.log('mounted')
        },
        beforeDestroy () {
            this.$el.querySelector('.messagesBox').removeEventListener('scroll', this.handleScroll);
            console.log('destroyed')
        },
        methods: {
            answer(message: string) {
                return this.$api.answerMessage(this.messages[this.messages.length - 1].message_id, message).then((json: Record<string, any>) => {
                    if(json.success) {
                        this.messages.push({
                            user_name: this.messages[this.messages.length - 2].user_name,
                            time: new Date(),
                            text: message
                        });
                    }

                    return json;
                });
            },

            getDialog(offset: number = 0) {
                this.isLoading = true;
                // todo: loading animation
                this.$api.getDialog(this.dialog_id, offset).then((json: Record<string, any>) => {
                    if(json.success) {
                        if(json.data.length) {
                            if(offset) {
                                this.messages = this.messages.concat(json.data);
                            } else {
                                this.messages = json.data;
                            }
                        } else {
                            this.isAllLoaded = true;
                        }
                    } else {
                        // todo error during loading, try again (button?)
                    }

                    this.isLoading = false;
                });
            },

            handleScroll(evt: Event) {
                const target = <HTMLElement>evt.target;

                if(target.scrollHeight - target.clientHeight - 100 < - target.scrollTop && !this.isLoading && !this.isAllLoaded) {
                    this.getDialog(this.messages.length);
                }
            }
        },

        beforeRouteEnter(to: Route, from: Route, next: NavigationGuardNext) {
            next((component: any) => {
                component.dialog_id = to.params.dialog_id;

                component.getDialog();
            });
        },
    });
</script>

<style scoped>
    .dialog {
        height: calc(100% - 186px);
    }

    .messagesBox {
        /* https://stackoverflow.com/a/44051405/16501014 */
        display: flex;
        flex-direction: column-reverse;
        height: calc(100% - 260px);
        overflow-y: scroll;
    }
</style>