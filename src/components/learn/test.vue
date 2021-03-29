<template>
    <div id="test" class="m-container m-background-body">
        <el-button @click="doShow">显示/隐藏</el-button>
        <el-button @click="changeImage">换图</el-button>
        <el-button @click="showDialog">对话框</el-button>

        <h1 v-if="isShow">哈哈哈</h1>
        <el-image v-if="isShow" :src="uploadUrl" class="m-margin-top"></el-image>

        <el-dialog title="添加照片" :visible.sync="dialogVisible" width="50%">
            <el-form :model="dialogData">
                <el-button @click="changeImage">换图</el-button>

                <el-image v-if="isShow" :src="uploadUrl" class="m-margin-top"></el-image>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addNote">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "test",
        data() {
            return {
                isShow: true,
                uploadUrl: 'http://liufengqiang.com/ee42f8c0-e5b1-11ea-8c9c-91fa4c243753.jpg',

                dialogVisible: false,
                dialogData: {},
            }
        },
        methods: {
            doShow() {
                this.isShow = !this.isShow;
            },
            changeImage() {
                this.uploadUrl = 'http://liufengqiang.com/a92d0220-e5b2-11ea-8c9c-91fa4c243753.jpeg'
            },
            showDialog() {
                this.dialogVisible = true;
            }
        }
    }
</script>

<style scoped>

</style>
