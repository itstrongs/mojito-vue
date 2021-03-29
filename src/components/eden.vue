<template>
    <div id="eden">
        <el-row class="m-margin-top-big">
            <el-col :span="16" :offset="4">
                <div class="m-text-align-center">
                    <h1>导航</h1>
                    <el-card class="box-card m-margin-top-big">
                        <el-row :gutter="20">
                            <el-col :span="6"><el-button type="primary" plain @click="hrefPage" class="m-width-fill">笔记</el-button></el-col>
                            <el-col :span="6"><el-button type="success" plain class="m-width-fill">项目部署</el-button></el-col>
                            <el-col :span="6"><el-button type="info" plain class="m-width-fill">hexo博客</el-button></el-col>
                            <el-col :span="6"><el-button type="warning" plain class="m-width-fill">测试</el-button></el-col>
                        </el-row>
                    </el-card>
<!--                    <el-image :src="imgUrl" class="m-margin-top-big"></el-image>-->
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "eden",
        data() {
            return {
                // imgUrl:require("../assets/images/IMG_1417.jpeg")
            }
        },
        methods: {
            hrefPage() {
                this.$router.push({path: 'note'})
            }
        }
    }
</script>

<style scoped>

</style>
