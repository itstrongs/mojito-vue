<template>
    <div>
        <Main :menuIndex="'5'"/>

        <div class="video-menu">
            <el-input v-model="videoSearch" placeholder="爬虫搜索资源：腾讯视频、爱奇艺、bilibili..." class="m-flex-child"></el-input>
            <el-button type="warning" plain class="m-margin-left">搜索</el-button>

            <el-input v-model="videoUrl" placeholder="请输入视频地址：腾讯视频、爱奇艺、bilibili..." class="m-flex-child m-margin-left"></el-input>
            <el-button type="warning" plain @click="download2" class="m-margin-left">解析</el-button>
        </div>


        <el-table :data="videoParseList" border style="width: 100%; margin: 0 1.5em" stripe height="560">
            <el-table-column prop="id" label="id" width="80"></el-table-column>

            <el-table-column prop="videoUrl" label="链接"></el-table-column>

            <el-table-column prop="videoName" label="视频名"></el-table-column>

            <el-table-column label="状态" width="80">
                <template slot-scope="scope">
                    {{ permission[scope.row.parseStatus].name }}
                </template>
            </el-table-column>

            <el-table-column label="操作" width="250">
                <template slot-scope="scope">
                    <el-popconfirm title="确定删除当前分类吗？" @onConfirm="deleteVideo(scope.row.id)">
                        <el-button slot="reference" type="danger" plain size="small" class="m-margin-left">删除</el-button>
                    </el-popconfirm>

                    <el-button type="info" plain @click="playVideo(scope.row.filePath)" size="small" class="m-margin-left" :disabled="scope.row.parseStatus!==1">下载</el-button>
                    <el-button type="primary" plain @click="playVideo(scope.row.filePath)" size="small" class="m-margin-left-big" :disabled="scope.row.parseStatus!==1">播放</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import Main from "@/components/main";

    export default {
        name: "video",
        components: {Main},
        data() {
            return {
                videoSearch: '',
                videoUrl: '',
                videoParseList: [],
                permission: [{"name": "解析中", "value": 0}, {"name": "解析成功", "value": 1}, {"name": "解析失败", "value": 2}],
            }
        },
        created() {
            this.$http.get('/video', {
                params: {}
            }).then(function (response) {
                console.log(response);
                this.videoParseList = response.data.data;
            }.bind(this));
        },
        methods: {
            download2() {
                // this.$http({
                //     method: 'post',
                //     url: '/video/parse?videoUrl=' + this.videoUrl,
                //     responseType: 'blob'
                // }).then(res => {
                //     this.download(res);
                // }).catch(error => {
                //     console.log(error);
                // });

                this.$http({
                    url: '/video/parse?videoUrl=' + this.videoUrl,
                    method: 'post',
                    // data: this.updateNote,
                    // header: {
                    //     'Content-Type': 'application/json'
                    // }
                }).then(res => {
                    console.log("新增笔记：" + res.data);
                    window.location.reload();
                });


                // this.$http.post('/video/download?videoUrl=' + this.videoUrl, {
                //     params: {}
                // }).then(function (response) {
                //     console.log(response);
                //     window.location.reload();
                // }.bind(this));
            },
            download(data) {
                if (!data) {
                    return
                }
                let url = window.URL.createObjectURL(new Blob([data]))
                let link = document.createElement('a')
                link.style.display = 'none'
                link.href = url
                link.setAttribute('download', 'excel.xlsx')

                document.body.appendChild(link)
                link.click()
            },
            playVideo(fileUrl) {
                console.log("openFile url = ", fileUrl);
                window.open("http://www.liufengqiang.com:8090/" + fileUrl);
            },
            deleteVideo(id) {
                console.log("id222==>",id);
                this.$http({
                    url: '/video/' + id,
                    method: 'delete',
                }).then(res => {
                    this.$message({
                        message: '删除成功！',
                        type: 'success'
                    });
                    console.log("删除成功" + res.data);
                    window.location.reload();
                });
            }
        },
    }
</script>

<style scoped>
    .video-menu {
        padding: 1.5em;
        display: flex;
    }
</style>
