<template>
    <div id="sentence" class="sentence">
        <div class="m-bg-transparent">
            <Main :menuIndex="'3'"/>

            <div class="m-container m-background-body container-water-fall">
                <div>
                    <el-tag type="success" size="mini" v-for="tag in sentenceTags" :key="tag" class="m-margin-right">#{{ tag }}#</el-tag>
                </div>

                <div class="m-margin-left-mini">
                    <el-button type="primary" plain size="small" @click="showDialog()">新增</el-button>
                    <el-button type="primary" plain size="small" @click="showDialog()">喜欢</el-button>
                    <el-button type="primary" plain size="small" @click="showDialog()">精选</el-button>
                </div>

                <waterfall :col="col" :data="data" @loadmore="loadmore" class="m-margin-top">
                    <el-card class="box-card m-margin-right m-margin-bottom" v-for="(sentence, index) in sentenceList" :key="index">
                        <div>
                            <el-tag type="success" size="mini" v-for="tag in sentence.tags" :key="tag" class="m-margin-right">#{{ tag }}#</el-tag>
                        </div>

                        <div class="m-margin-top m-text-bold m-color-teal">+ {{ sentence.source }}</div>

                        <div class="text-content" v-html="sentence.content"></div>

                        <div class="m-margin-top m-text-align-center">
                            <i class="el-icon-s-opportunity"></i> {{ sentence.favourNum }}
                            <i class="el-icon-chat-dot-round m-margin-left"></i> {{ sentence.commentNum }}
                        </div>
                    </el-card>
                </waterfall>
                <loading :show="loading"/>
            </div>
        </div>
    </div>
</template>

<script>
    import Main from "@/components/main";
    import loading from "./loading";

    export default {
        props: {
            title: String
        },
        components: {
            Main,
            loading
        },
        data() {
            return {
                range: '1',
                sentenceList: [],
                // url: 'http://pic1.win4000.com/wallpaper/5/58575585dbbf1.jpg',
                // imgsArr: [
                //     'http://pic1.win4000.com/wallpaper/5/58575585dbbf1.jpg',
                //     'http://pic-bucket.ws.126.net/photo/0003/2020-07-26/FIG0JHVB00AJ0003NOS.jpg',
                //     'http://pic1.win4000.com/wallpaper/a/584ba8f74d136.jpg',
                //     'http://m.imeitou.com/uploads/allimg/2020050713/x5vx1e0b15g.jpeg',
                //     'http://m.imeitou.com/uploads/allimg/2020062608/jmlsojorzmj.jpeg',
                //     'http://www.qqtouxiang.com/d/file/wm/img/20170607/rj255pb30jscar0z.jpg',
                //     'http://www.qqtouxiang.com/d/file/wm/img/20170607/rj2553xt1ndi1q1b.jpg',
                //     'http://www.qqtouxiang.com/d/file/wm/img/20170608/loo255e3jksj0g0bu.jpg',
                // ],

                data: [],
                col: 2,
                loading: false,
                sentenceTags: [],
            };
        },
        computed: {
            itemWidth() {
                return 133 * 0.5 * (document.documentElement.clientWidth / 375);
            },
            gutterWidth() {
                return 10 * 0.5 * (document.documentElement.clientWidth / 375);
            }
        },
        created() {
            this.getSentence();
            this.getSentenceTags();
        },
        methods: {
            getSentence() {
                this.loading = true;
                this.$http.get('/micro-sentence?range=' + this.range)
                    .then(function (response) {
                        this.sentenceList = response.data.data;
                        this.data = this.sentenceList;
                    }.bind(this));
                this.loading = false;
            },

            // getImage() {
            //     return this.imgsArr[~~(Math.random() * this.imgsArr.length)];
            // },
            isShow() {
                return ~~(Math.random() * 3) > 1;
            },

            // reset() {
            //     this.data = [];
            // },

            // switchCol(col) {
            //     this.col = col;
            // },

            loadmore() {
                this.loading = true;
                setTimeout(() => {
                    this.data = this.data.concat(this.originData, this.originData);
                    this.loading = false;
                }, 1000);
            },
            getSentenceTags() {
                this.$http.get('/micro-sentence/tags', {
                    params: {}
                }).then(function (response) {
                    this.sentenceTags = response.data.data;
                }.bind(this));
            }
        },
    };
</script>

<style lang="less" scoped>
    .sentence {
        background: url('../assets/images/bg5.jpeg') no-repeat fixed center;
        background-size: cover;
    }

    .text-content {
        line-height: 1.6;
        color: #000;
        margin-top: 1em;
        letter-spacing: 2.5px
    }

    * {
        margin: 0;
    }

    .container-water-fall {
        // padding: 0 28px;
        width: 100vw;
        box-sizing: border-box;

        .cell-item {
            width: 100%;
            // margin-bottom: 18px;
            background: #ffffff;
            border: 2px solid #F0F0F0;
            border-radius: 12px 12px 12px 12px;
            overflow: hidden;
            box-sizing: border-box;

            img {
                // border-radius: 12px 12px 0 0;
                width: 100%;
                height: auto;
                display: block;
            }

            .item-body {
                // border: 1px solid #F0F0F0;
                padding: 12px;

                .item-desc {
                    font-size: 15px;
                    color: #333333;
                    line-height: 15px;
                    font-weight: bold;
                }

                .item-footer {
                    margin-top: 22px;
                    position: relative;
                    display: flex;
                    align-items: center;

                    .avatar {
                        width: 44px;
                        height: 44px;
                        border-radius: 50%;
                        background-repeat: no-repeat;
                        background-size: contain;
                    }

                    .name {
                        max-width: 150px;
                        margin-left: 10px;
                        font-size: 14px;
                        color: #999999;
                    }

                    .like {
                        position: absolute;
                        right: 0;
                        display: flex;
                        align-items: center;

                        &.active {
                            i {
                            }

                            .like-total {
                                color: #FF4479;
                            }
                        }

                        i {
                            width: 28px;
                            display: block;
                        }

                        .like-total {
                            margin-left: 10px;
                            font-size: 12px;
                            color: #999999;
                        }
                    }
                }
            }
        }
    }
</style>
