<template>
    <div id="login">
        <h1 class="m-color-white">导航页</h1>

        <a href="">
            <button type="button" class="myBgColor4 my-top-btn">博</button>
            <br><br>
            <span class="m-color-white m-margin-top">博客</span>
        </a>

        <a href="">
            <button type="button" class="myBgColor4 my-top-btn">博</button>
            <br><br>
            <span class="m-color-white m-margin-top">博客</span>
        </a>
    </div>
</template>

<script>
    export default {
        name: "navigation"
    }
</script>

<style scoped>
    #login {
        width: 40em;
        margin: 0 auto;
    }

    .my-top-btn {
        font-family: 'Microsoft YaHei';
        font-size: 24px;
        width: 52px;
        height: 52px;
        border-radius: 15px;
        text-align: center;
        vertical-align: middle;
        user-select: none;
        text-transform: uppercase;
        display: inline-block;
        padding: 0px;
        margin: 0px;
    }

    .myBgColor4 {
        color: #FFFFFF !important;
        border: 1px solid #A0D468;
        background-color: #A0D468;
    }
</style>
