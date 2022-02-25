<template>
    <div class="message">
        <header>
            <div class="userName">{{userName}}</div>
            <div class="time">{{time.toLocaleDateString('ru-ru', {hour: 'numeric', minute: 'numeric'})}}</div>
        </header>
        <div class="text">{{text}}</div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";

    export default Vue.extend({
        name: "message",
        props: {
            userName: {
                type: String
            },
            time: {
                type: Date,
                required: true
            },
            text: {
                type: String,
                required: true
            }
        }
    });
</script>

<style scoped>
    .message {
        background: #FFFFFF;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        border-radius: 6px;
        padding: 20px;

        font-family: Raleway, sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 18px;

        color: #2B2B2B;
    }

    .message > header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
    }

    .message > header > .userName,
    .message > header > .time {
        color: #9A9A9A;
    }
</style>