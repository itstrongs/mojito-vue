<template>
    <div class="div-body">
        <Main :menuIndex="'3'"/>

        <div>
            <div class="loader-layer" :class="isMobile ? 'div-mobile' : 'div-main'">
                <div v-if="isMobile" >
                    <div class="div-item" v-for="tool in tools" :key="tool" @click="openFile(tool)">
                        <div class="m-flex">
                            <span class="m-text-bold">{{ tool.name }}</span>
                            <el-tag type="info" class="m-cursor m-text-align-right" >{{ tool.operation }}
                            </el-tag>
                        </div>

                        <el-divider class="m-margin-top-small m-margin-bottom-small"></el-divider>
                        <span class="">{{ tool.desc }}</span>
                    </div>
                </div>

                <el-row :gutter="20" v-if="!isMobile">
                    <el-col :span="6" v-for="tool in tools" :key="tool">
                        <div class="div-item">
                            <div class="m-flex m-cursor" @click="openFile(tool)">
                                <span class="m-text-bold">{{ tool.name }}</span>
                                <el-tag type="success" class="m-cursor m-text-align-right" >{{ tool.operation }}
                                </el-tag>
                            </div>

                            <el-divider class="m-margin-top-small m-margin-bottom-small"></el-divider>
                            <span class="m-font-size-small">{{ tool.desc }}</span>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
    import Main from "@/components/main";

    export default {
        name: "tools",
        components: {Main},
        data() {
            return {
                tools: [
                    {
                        name: '摸鱼',
                        toolUrl: '/time-machine',
                        operation: "打开",
                        desc: '记录生活',
                        isOutsideChain: false
                    },
                    {
                        name: '佳句',
                        toolUrl: '/sentence',
                        operation: "打开",
                        desc: '记录一些喜欢的句子',
                        isOutsideChain: false
                    },
                    {
                        name: '照片墙',
                        toolUrl: '/photo-wall',
                        operation: "打开",
                        desc: '记录一些拍的好的照片',
                        isOutsideChain: false
                    },
                    {
                        name: 'TODO',
                        toolUrl: '/todo',
                        operation: "打开",
                        desc: '待办、计划',
                        isOutsideChain: false
                    },
                    {
                        name: 'Jenkins',
                        toolUrl: 'http://www.liufengqiang.com:8088',
                        operation: "打开",
                        desc: '自动化构建工具',
                        isOutsideChain: true
                    },
                    {
                        name: 'Netdata',
                        toolUrl: 'http://www.liufengqiang.com:8085',
                        operation: "打开",
                        desc: '可视化服务器监控工具',
                        isOutsideChain: true
                    },
                    {
                        name: '个人云盘',
                        toolUrl: '/cloud-disk',
                        operation: "打开",
                        desc: '简单存一些分享的东西，微信传文件功能太难用了',
                        isOutsideChain: false
                    },
                    {
                        name: '阴阳师挂机app',
                        toolUrl: 'http://cdn.liufengqiang.com/charles-yys-release-v2.0.apk',
                        operation: "下载",
                        desc: '自己写的阴阳师挂机app，模拟器运行，解放双手。',
                        isOutsideChain: true
                    },
                    {
                        name: '视频下载解析',
                        toolUrl: '/video',
                        operation: "打开",
                        desc: '解析腾讯视频、爱奇艺等视频资源（流程ok，服务器带宽太差，暂时放弃）',
                        isOutsideChain: false
                    },
                    {
                        name: '爬虫数据分析',
                        toolUrl: '',
                        operation: "打开",
                        desc: '写一个爬虫程序（待完成）',
                        isOutsideChain: false
                    },

                ],
                isMobile: false,
            }
        },
        mounted() {
            this.isMobile = this.$AppUtils.isMobile();
        },
        methods: {
            openFile(tool) {
                if (tool.isOutsideChain) {
                    window.open(tool.toolUrl);
                } else {
                    this.$router.push({path: `${tool.toolUrl}`});
                }
            },
        }
    }
</script>

<style scoped>
    .div-body {
        background: #F1F3F2;
        width: 100%;
        min-height: 800px;
    }
    .div-mobile {
        padding: 1em;
    }
    .div-main {
        background: #FFFFFF;
        width: 70%;
        margin: 0 auto;
        padding: 2em;
        min-height: 800px;
    }
    .div-item {
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 0.75em;
        height: 85px;
        margin-bottom: 1em;
    }
</style>
