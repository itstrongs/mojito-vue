<template>
    <div class="layout-home">
        <Main :menuIndex="'3'"></Main>

        <div :class="{ item_width : !isMobile }">
            <div class="layout-publish">
                <el-input
                        type="textarea"
                        :autosize="{ minRows: 3, maxRows: 5}"
                        placeholder="请输入内容"
                        v-model="content">
                </el-input>

                <div class="m-margin-top-small">
                    <i class="el-icon-picture m-text-size-large"></i>

                    <!--                    <el-dialog :visible.sync="dialogVisible">-->
                    <!--                        <img width="100%" :src="dialogImageUrl" alt="">-->
                    <!--                    </el-dialog>-->
                    <!--                    -->
                    <!--                    <i class="el-icon-plus upload-add"></i>-->

                    <el-button type="primary" size="small" class="m-float-right" @click="publish">发布</el-button>
                </div>
            </div>

            <div class="layout-item" v-for="time in timeMachine" :key="time">
                <el-row :gutter="10">
                    <el-col :span="3">
                        <el-avatar :size="40" :src="portrait"></el-avatar>
                    </el-col>

                    <el-col :span="18">
                        <div class="text-name">天邪鬼切</div>
                        <div class="text-desc">希望不是等待，希望是改变！<span class="m-margin-left">{{ time.createdAt }}</span>
                        </div>
                    </el-col>

                    <el-col :span="3">
                        <el-popconfirm title="确定删除吗？" @onConfirm="deleteItem(time.id)">
                            <el-button type="danger" icon="el-icon-delete" circle plain size="mini" slot="reference"
                                       class="m-margin-left"></el-button>
                        </el-popconfirm>
                    </el-col>
                </el-row>

                <div class="m-margin-top-small m-color-black" style="white-space: pre-wrap">
                        {{ time.content }}
                </div>

                <div>
                    <el-image :src="img" fit="cover" class="item-img m-margin-right m-margin-top-small" v-for="img in time.imageUrls"
                              :key="img"></el-image>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Main from "@/components/main";

    export default {
        name: "time-machine",
        components: {Main},
        created() {
            this.$http.get('/time-machine', {
                params: {}
            }).then(function (response) {
                this.timeMachine = response.data.data;
            }.bind(this));
        },
        mounted() {
            this.isMobile = this.$AppUtils.isMobile();
        },
        data() {
            return {
                timeMachine: [],
                addTimeMachine: {},
                portrait: 'http://cdn.liufengqiang.com/FmdZV3IptUDq9pYyP8iVlMPOw2tI',

                dialogImageUrl: '',
                dialogVisible: false,
                content: '',
                isMobile: false,
            }
        },
        methods: {
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            publish() {
                this.addTimeMachine.content = this.content;
                this.$http({
                    url: '/time-machine',
                    method: 'post',
                    data: this.addTimeMachine,
                    header: {
                        'Content-Type': 'application/json'
                    }
                }).then(function (response) {
                    if (response.data.code === 200) {
                        window.location.reload();
                    } else {
                        this.$message.error(response.data.msg);
                    }
                }.bind(this));
            },
            deleteItem(id) {
                this.$http({
                    url: '/time-machine/' + id,
                    method: 'delete',
                }).then(function (response) {
                    if (response.data.code === 200) {
                        window.location.reload();
                    } else {
                        this.$message.error(response.data.msg);
                    }
                }.bind(this));
            },
        }
    }
</script>

<style scoped>
    .layout-home {
        background: #F1F3F2;
        width: 100%;
        min-height: 800px;
    }

    .layout-publish {
        background: #FFFFFF;
        /*width: 700px;*/
        margin: 0 auto;
        padding: 1em;
    }

    .layout-item {
        background: #FFFFFF;
        margin: 0.5em auto;
        padding: 1em;
    }

    .text-name {
        font-weight: bold;
    }

    .text-desc {
        font-size: 0.5em;
        color: #7C8D9B;
        margin-top: 0.5em;
    }

    .upload-add {
        width: 50px;
        height: 50px;
        border: 1px solid #3a3a3a;
        background: #F9FDFF;
        text-align: center;
        margin-left: 1em;
        border-radius: 10px;
        line-height: 50px;
    }

    .item-img {
        width: 150px;
        height: 100px;
    }
    .item_width {
        width: 700px;
        margin: 0 auto;
    }
</style>
