<template>
    <div class="myDialogs">
        <div class="dialog" v-for="dialog in dialogs">
            <message class="message" :user-name="dialog.user_name_1" :time="dialog.time_1" :text="dialog.text_1"></message>
            <message class="message" :user-name="dialog.user_name_2" :time="dialog.time_2" :text="dialog.text_2"></message>
            <router-link class="answer" :to="{ name: 'dialog', params: { dialog_id: dialog.dialog_id } }">Ответить</router-link>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import {NavigationGuardNext, Route} from "vue-router";
    import message from './components/message.vue';

    export default Vue.extend({
        name: "myDialogs",
        components: {
            message
        },
        data: function() {
            return {
                dialogs: []
            };
        },
        methods: {
            getDialogs(offset: number) {
                this.$api.getDialogs(offset).then((json: Record<string,any>) => {
                    if(json.success) {
                        if(json.data.length) {
                            if(offset) {
                                //
                            } else {
                                this.dialogs = json.data;
                            }
                        } else {
                            // todo
                            // end of dialogs, not load anymore
                        }
                    } else {
                        // todo
                    }
                });
            }
        },
        beforeRouteEnter(to: Route, from: Route, next: NavigationGuardNext) {
            next((component: any) => {
                component.getDialogs(0);
            });
        },
        beforeRouteUpdate(to: Route, from: Route, next: NavigationGuardNext) {
            this.getDialogs(0);
            next();
        }
    });
</script>

<style scoped>
    .dialog {
        padding: 20px;
        border: 1px solid grey;
        border-radius: 16px;
    }

    .message {
        margin-bottom: 20px;
    }

    .message:nth-child(even) {
        /*color: #9A9A9A;*/
    }

    .answer {
        display: block;
        margin: 0 auto;
        padding: 10px;

        width: 200px;
        cursor: pointer;

        background: #222222;
        border-radius: 6px;

        text-align: center;
        color: #FFFFFF;
    }
</style>