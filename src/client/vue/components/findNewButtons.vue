<template>
    <div class="buttons">
        <router-link class="myMessages" :to="{ name: 'myDialogs' }">Мои записки</router-link>
        <router-link class="writeNew" :to="{ name: 'root' }">Написать записку</router-link>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";

    export default Vue.extend({
        name: "findNewButtons"
    });
</script>

<style scoped>
    a {
        display: block;
    }

    .myMessages {
        display: block;
        width: 200px;
        margin: 0 auto 16px auto;
        padding: 10px;
        background: #E4E6EC;
        border-radius: 6px;
        font-size: 12px;
        text-align: center;
    }

    .writeNew {
        font-size: 12px;
        text-align: center;
        color: #A29DAD;
    }
</style>