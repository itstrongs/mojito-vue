<template>
    <div id="photo-wall" class="photo-wall">
        <Main :menuIndex="'4'"/>

        <div class="m-container m-padding">
            <el-row :gutter="10">
                <el-col :span="2" class="m-margin-left-mini">
                    <el-button type="primary" plain size="small" @click="showDialog()" class="m-width-fill">新增</el-button>
                </el-col>

                <el-col :span="2" :offset="8">
                    <el-button type="primary" plain size="small" @click="showDialog()" class="m-width-fill">我的</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" plain size="small" @click="showDialog()" class="m-width-fill">精选</el-button>
                </el-col>
            </el-row>

            <waterfall :col="col" :data="photoWalls">
                <div v-for="(photo, index) in photoWalls" :key="index" style="background: #FFFFFF;" class="m-padding-small m-margin-top m-margin-right">
                    <div style="background: #171717">
                        <el-image style="width: 100%" :src="photo.photoUrl"></el-image>
                        <div class="m-color-white m-padding-mini" v-html="photo.impression"></div>
                    </div>
                </div>
            </waterfall>

            <!--新增对话框-->
            <el-dialog title="添加照片" :visible.sync="dialogVisible" width="50%">
                <el-form :model="dialogData">
                    <!--                <el-input type="file" id="uploadFileInput" @change="uploadImage" accept="image/*"></el-input>-->
                    <input @change="uploadImage"  id="uploadFileInput1" type="file" accept="image/*">

                    <span>上传进度：{{ schedule }}%</span>

                    <el-image :src="uploadUrl" class="m-margin-top"></el-image>
                    <!--                v-if="uploadFinish"-->

                    <el-input type="textarea" :rows="3" placeholder="想法" class="m-margin-top"
                              v-model="dialogData.content"></el-input>
                </el-form>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addNote">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import Main from "@/components/main";
    import * as qiniu from 'qiniu-js'
    import uuidv1 from 'uuid/v1'

    export default {
        name: "photo-wall",
        components: {
            Main,
        },
        data() {
            return {
                upToken: '',
                range: 1,
                col: 2,
                photoWalls: [],

                dialogImageUrl: '',
                // dialogVisible: false,

                dialogVisible: false,
                dialogData: {},

                uploadUrl: 'http://liufengqiang.com/ee42f8c0-e5b1-11ea-8c9c-91fa4c243753.jpg',
                uploadFinish: false,

                schedule: 0,
            };
        },
        created() {
            this.getPhotoWall();
        },
        methods: {
            getPhotoWall() {
                this.$http.get('/photo-story/list?range=' + this.range)
                    .then(function (response) {
                        this.photoWalls = response.data.data;
                        console.log("photoWalls==>", this.photoWalls);
                    }.bind(this));
            },

            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                // this.dialogVisible = true;
            },

            addNote() {

            },

            showDialog() {
                this.dialogVisible = true;
            },

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
                let key = uuidv1() + file.name.substring(file.name.lastIndexOf('.'), file.name.length);
                console.log("文件名2==》", key);
                let putExtra = {
                    fname: file,
                    params: {},
                    mimeType: ["image/png", "image/jpeg", "image/gif"]
                };
                let config = {
                    useCdnDomain: true,
                    region: qiniu.region.z2
                };
                let observe = {
                    next(res) {
                        console.log('已上传大小，单位为字节：' + res.total.loaded)
                        console.log('本次上传的总量控制信息，单位为字节：' + res.total.size)
                        console.log('当前上传进度，范围：0～100：' + res.total.percent);
                        this.schedule = res.total.percent;
                    },
                    error(err) {
                        console.log(err.code)
                        console.log(err.message)
                        console.log(err.isRequestError)
                        console.log(err.reqId)
                    },
                    complete(res) {
                        //完成后的操作
                        //上传成功以后会返回key 和 hash  key就是文件名了！
                        console.log(res);
                        this.uploadUrl = 'http://liufengqiang.com/' + res.key;
                        console.log("上传成功了==>", this.uploadUrl);
                        this.uploadFinish = true;
                    }
                };

                // const options = {
                //     quality: 0.92,
                //     noCompressIfLarger: true
                //     // maxWidth: 1000,
                //     // maxHeight: 618
                // }

                // qiniu.compressImage(file, options).then(data => {
                //     console.log("data==>", data);
                    const observable = qiniu.upload(file, key, this.upToken, putExtra, config);
                    const subscription = observable.subscribe(observe); // 上传开始
                    console.log("subscription==>", subscription);
                // });
            },
        }
    }
</script>

<style scoped>
    .photo-wall {
        /*background: url('../assets/images/bg0.jpeg') no-repeat fixed center;*/
        background: #1C191C;
    }
</style>
