<template>
    <div class="clientContainer">
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";

    export default Vue.extend({
        name: "client"
    });
</script>

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
</style>

<style scoped>
    .clientContainer {
        height: 100%;
    }
</style>
