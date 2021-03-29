<template>
    <div>
        <el-form ref="form" :model="note">
            <div class="note-parent">
                <div class="note-header">
                    <el-row :gutter="20">
                        <el-col :span="14">
                            <el-form-item label="标题" label-width="40px">
                                <el-input v-model="note.name"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="7">
                            <el-form-item label="插图" label-width="40px">
                                <input @change="uploadImage" id="uploadFileInput" type="file" accept="image/*">
                                <el-tag type="warning" size="medium" class="m-cursor"><i class="el-icon-delete"></i></el-tag>
                            </el-form-item>
                        </el-col>

                        <el-col :span="3">
                            <el-button @click="cancel">取 消</el-button>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="5">
                            <el-form-item label="类型" label-width="40px">
                                <el-select v-model="note.noteType" placeholder="默认分类" filterable allow-create default-first-option>
                                    <el-option :label="item.name" :value="item.value" v-for="(item, index) in noteType" :key="index"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="5">
                            <el-form-item label="分类" label-width="40px">
                                <el-input v-model="note.category"></el-input>
<!--                                <el-select v-model="note.categoryName" placeholder="默认分类" filterable allow-create default-first-option>-->
<!--                                    <el-option :label="category.name" :value="category.name" v-for="(category, index) in noteList" :key="index"></el-option>-->
<!--                                </el-select>-->
                            </el-form-item>
                        </el-col>

                        <el-col :span="5">
                            <el-form-item label="权限" label-width="40px">
                                <el-select v-model="note.permission" placeholder="默认公开" filterable allow-create default-first-option>
                                    <el-option :label="item.name" :value="item.value" v-for="(item, index) in permission" :key="index"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="6">
                            <el-form-item label="日期" label-width="40px">
                                <el-date-picker v-model="note.createdAt" type="date" placeholder="默认当天"></el-date-picker>
                            </el-form-item>
                        </el-col>

                        <el-col :span="3">
                            <el-button type="primary" @click="editNote">确 定</el-button>
                        </el-col>
                    </el-row>
                </div>

                <div class="note-content">
                    <div class="note-left">
                        <textarea autofocus="autofocus" v-model="note.content" class="test-content" @blur.prevent="lostFocus()"></textarea>
                    </div>

                    <div class="note-right">
                        <div v-html="note.contentHtml" id="nice" class="js-toc-content m-margin-bottom-big m-margin-top m-margin-left-big div-note-html"></div>
                    </div>
                </div>
            </div>
        </el-form>
    </div>
</template>

<script>
    import * as tocbot from "tocbot";
    import * as qiniu from "qiniu-js";

    export default {
        name: "note-edit",
        data() {
            return {
                note: {
                    name: '',
                },
                categoryId: '',
                permission: [{"name": "公开", "value": 0}, {"name": "匿名", "value": 1}, {"name": "私有", "value": 2}],
                noteType: [{"name": "开发", "value": 0}, {"name": "生活", "value": 1}, {"name": "杂文", "value": 2}],
                uploadUrl: '',
            }
        },
        created() {
            this.categoryId = this.$route.query.categoryId;
            this.getNote();
        },
        methods: {
            getNote() {
                let noteId = this.$route.query.id;
                console.log("noteId", noteId);
                if (noteId) {
                    this.$http.get('/note/' + noteId, {
                        params: {}
                    }).then(function (response) {
                        this.note = response.data.data;
                        this.$nextTick(() => {
                            tocbot.init({
                                // Where to render the table of contents.
                                tocSelector: '.js-toc',
                                // Where to grab the headings to build the table of contents.
                                contentSelector: '.js-toc-content',
                                // Which headings to grab inside of the contentSelector element.
                                headingSelector: 'h1, h2, h3, h4',
                                // For headings inside relative or absolute positioned containers within content.
                                hasInnerContainers: true,
                                positionFixedSelector: ".toc", //目录位置固定
                            });
                        })
                    }.bind(this));
                }
            },
            cancel() {
                // this.$router.go(-1);
                // this.$router.back(-1);
                // window.history.go(-1);
            },
            editNote() {
                console.log("this.uploadUrl", this.uploadUrl);
                if (this.uploadUrl) {
                    // this.note.picture = this.uploadUrl;
                    this.note.picture = this.noteDetails.picture;
                }
                // else {
                //
                // }

                if (this.categoryId) {
                    this.note.categoryId = this.categoryId;
                }
                console.log("新增/修改笔记: ", this.note);
                this.$http({
                    url: '/note',
                    method: 'post',
                    data: this.note,
                    header: {
                        'Content-Type': 'application/json'
                    }
                }).then(res => {
                    console.log("新增笔记：" + res.data);
                    window.location.reload();
                });
            },

            // 文件上传
            uploadImage() {
                console.log("开始上传");
                let file = document.getElementById("uploadFileInput").files[0];   //选择的图片文件
                console.log("文件名==>", file);
                this.uploadImgToQiniu(file);
            },
            uploadImgToQiniu(file) {
                this.$http.get('/qiniu/token')
                    .then(function (response) {
                        this.upToken = response.data.data;
                        console.log("七牛token==>", this.upToken);
                        this.upload(file);
                    }.bind(this));
            },
            upload(file) {
                console.log("文件名1==》", file);
                let putExtra = {
                    fname: file,
                    params: {},
                    mimeType: ["image/png", "image/jpeg", "image/gif"]
                };
                let config = {
                    useCdnDomain: true,
                    region: qiniu.region.z2
                };

                const observable = qiniu.upload(file, null, this.upToken, putExtra, config);
                let that = this;
                const subscription = observable.subscribe({
                    next(res) {
                        console.log('已上传大小，单位为字节：' + res.total.loaded);
                        console.log('本次上传的总量控制信息，单位为字节：' + res.total.size);
                        console.log('当前上传进度，范围：0～100：' + res.total.percent);
                    },
                    error(err) {
                        console.log(err)
                    },
                    complete(res) {
                        //上传成功以后会返回key 和 hash  key就是文件名了！
                        console.log(res);
                        that.uploadUrl = 'http://cdn.liufengqiang.com/' + res.key;
                        console.log("上传成功了==>", that.uploadUrl);
                        that.$message({
                            message: '上传成功！',
                            type: 'success'
                        });
                    }
                }); // 上传开始
                console.log("subscription==>", subscription);
            },
        }
    }
</script>

<style scoped>
    .note-parent {
        height: 100vh;
    }
    .note-header {
        padding: 1.5em 2em 0;
    }
    .note-content {
        height: calc(100vh - 150px);
        display: flex;
    }
    .test-content {
        background: transparent;
        outline: none;
        border: none;
        width: 100%;
        height: 100%;
        padding: 1em;
        font-size: 1em;
        overflow: auto;
    }
    .note-left {
        flex: 1;
        background: #F7F7F7;
        padding: 1em 2em ;
        overflow: auto;
    }
    .note-right {
        flex: 1;
        background: #F1F3F2;
        overflow: auto;
    }
</style>
