<template>
<!--    <div>-->
<!--&lt;!&ndash;        <el-container>&ndash;&gt;-->
<!--&lt;!&ndash;            <el-header>Header</el-header>&ndash;&gt;-->
<!--&lt;!&ndash;            <el-main class="m-bg-color-danger">Main</el-main>&ndash;&gt;-->
<!--&lt;!&ndash;        </el-container>&ndash;&gt;-->

<!--&lt;!&ndash;        <div style="position: absolute; left: 0pt; top: 100px;">&ndash;&gt;-->
<!--&lt;!&ndash;            <div class="header">&ndash;&gt;-->
<!--&lt;!&ndash;            </div>&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->
<!--&lt;!&ndash;        <div style="height:2000px; background-color: #DEFBFF;"></div>&ndash;&gt;-->

<!--        <div style="width: 100%;height: 100px; background: #ff6666">-->

<!--        </div>-->
<!--    </div>-->

<!--    行内快布局-->
<!--    <div style="font-size: 0;height: 100%;background-color: #ff6666;">-->
<!--        <div style="width: 50%;height: 100%;background-color: #ff6666;display: inline-block;"></div>-->
<!--        <div style="width: 50%;height: 100%;background-color: #00B5AD;display: inline-block;"></div>-->
<!--    </div>-->
    <div class="div-main">
        <div class="div-1">是根深蒂固</div>
        <div class="div-2">是根深蒂固</div>
        <div class="div-3">是根深蒂固</div>
    </div>
</template>

<script>
    export default {
        name: "container"
    }
</script>

<style scoped>
    .div-main {
        /*height: 100%;*/
    }
    .div-1 {
        width: 25%;
        height: 500px;
        background-color: #00B5AD;
        display: inline-block;
    }
    .div-2 {
        width: 50%;
        height: 500px;
        background-color: #ff6666;
        display: inline-block;
        margin: auto;
    }
    .div-3 {
        width: 25%;
        height: 500px;
        background-color: #00B5AD;
        display: inline-block;
    }

    .el-header, .el-footer {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 60px;
    }
    /*.header {*/
    /*    padding: 10px 0 0;*/
    /*    position: fixed;*/
    /*    width: 300px;*/
    /*    height:50px;*/
    /*    background-color:#000;*/
    /*    opacity: 0.2;*/
    /*    filter:alpha(opacity=20);*/
    /*}*/
</style>
