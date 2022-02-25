<template>
    <div class="chat">
        <write-message :sendMessageMethod="sendMessage" :button-text="'Отправить'"></write-message>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import writeMessage from './components/writeMessage.vue';

    export default Vue.extend({
        name: "chat",
        components: {
            writeMessage: writeMessage
        },
        methods: {
            sendMessage(message: string, name?: string) {
                return this.$api.sendMessage.call(this, message, name);
            }
        }
    });
</script>

<style scoped>
</style>