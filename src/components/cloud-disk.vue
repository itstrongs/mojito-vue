<template>
    <div>
        <Main :menuIndex="'5'"/>

        <div class="layout-home">
            <div class="layout-publish">
                <div>
                    <el-button type="primary">上传</el-button>
                    <el-button plain>新建文件夹</el-button>
                </div>

                <el-divider></el-divider>

                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/cloud-disk' }" v-for="folder in folderNameList" :key="folder">{{ folder }}</el-breadcrumb-item>
                </el-breadcrumb>

                <el-table :data="fileList" stripe style="width: 100%">
                    <el-table-column label="文件名">
                        <template slot-scope="scope">
                            <span style="font-size: 1.2em">
                                <i class="el-icon-document-checked" v-if="!scope.row.isFolder"></i>
                                <i class="el-icon-folder-opened" v-if="scope.row.isFolder"></i>
                            </span>
                            <span class="m-margin-left m-cursor m-color-black" @click="clickFile(scope.row)">{{ scope.row.fileName }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="createdAt" label="创建时间" width="150"></el-table-column>

                    <el-table-column prop="fileSize" label="文件大小" width="100"></el-table-column>

                    <el-table-column prop="fileSize" label="操作" width="150">
                        <template slot-scope="scope" v-if="!scope.row.isFolder">
                            <el-tag type="warning" @click="copyAddress" class="m-cursor">复制地址</el-tag>
                            <el-tag type="info" class="m-margin-left m-cursor" @click="openFile(scope.row.fileUrl)">下载</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
    import Main from "@/components/main";

    export default {
        name: "cloud-disk",
        components: {Main},
        data() {
            return {
                fileList: [],
                parentId: '',
                folderNameList: ['全部'],
            }
        },
        created() {
            this.getFileList();
        },
        methods: {
            getFileList() {
                this.$http.get('/cloud-disk?parentId=' + this.parentId, {
                    params: {}
                }).then(function (response) {
                    this.fileList = response.data.data;
                }.bind(this));
            },
            copyAddress() {
                this.$message({
                    message: '复制成功！',
                    type: 'success'
                });
            },
            openFile(fileUrl) {
                window.location = fileUrl;
            },
            clickFile(cloudDisk) {
                if (cloudDisk.isFolder) {
                    this.parentId = cloudDisk.id;
                    this.folderNameList.push(cloudDisk.fileName);
                    this.getFileList();
                } else {
                    this.openFile(cloudDisk.fileUrl);
                }
            }
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
        width: 800px;
        margin: 0 auto;
        padding: 1em;
    }
</style>
