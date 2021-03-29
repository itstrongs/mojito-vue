<template>
    <div id="sentence" class="m-container m-background-body">
        <Main :menuIndex="'2'"/>

        <!--        <el-tabs v-model="range" @tab-click="handleClick" stretch="true">-->
        <!--            <el-tab-pane label="推荐" name="0">-->
        <!--                <div>-->
        <!--                    <el-card class="box-card m-margin-top" v-for="sentence in sentenceList" :key="sentence">-->
        <!--                        <div><el-tag type="success" size="mini">#{{ sentence.category }}#</el-tag></div>-->
        <!--                        <div class="m-margin-top m-text-bold">+ {{ sentence.source }}</div>-->
        <!--                        <div class="m-margin-top" v-html="sentence.content"></div>-->
        <!--                        <div class="m-margin-top m-text-align-center">-->
        <!--                            <i class="el-icon-s-opportunity"></i> {{ sentence.favourNum }}-->
        <!--                            <i class="el-icon-chat-dot-round m-margin-left"></i> {{ sentence.commentNum }}-->
        <!--                        </div>-->
        <!--                    </el-card>-->
        <!--                </div>-->
        <!--            </el-tab-pane>-->

        <!--            <el-tab-pane label="我的" name="1">-->
        <!--                <div>-->
        <!--                    <el-card class="box-card m-margin-top" v-for="sentence in sentenceList" :key="sentence">-->
        <!--                        <div><el-tag type="success" size="mini">#{{ sentence.category }}#</el-tag></div>-->
        <!--                        <div class="m-margin-top m-text-bold">+ {{ sentence.source }}</div>-->
        <!--                        <div class="m-margin-top">{{ sentence.content }}</div>-->
        <!--                        <div class="m-margin-top m-text-align-center">-->
        <!--                            <i class="el-icon-s-opportunity"></i> {{ sentence.favourNum }}-->
        <!--                            <i class="el-icon-chat-dot-round m-margin-left"></i> {{ sentence.commentNum }}-->
        <!--                        </div>-->
        <!--                    </el-card>-->
        <!--                </div>-->
        <!--            </el-tab-pane>-->
        <!--        </el-tabs>-->

        <div>
            <waterfall
                    :align="align"
                    :line-gap="500"
                    :min-line-gap="100"
                    :max-line-gap="220"
                    :single-max-width="300"
                    :watch="items"
                    @reflowed="reflowed"
                    ref="waterfall">
                <!-- each component is wrapped by a waterfall slot -->
                <waterfall-slot
                        v-for="(item, index) in items"
                        :width="item.width"
                        :height="item.height"
                        :order="index"
                        :key="item.index"
                        move-class="item-move">

                    <el-card class="box-card m-margin-top">
                        <div>
                            <el-tag type="success" size="mini">#{{ item.category }}#
                            </el-tag>
                        </div>
                        <div class="m-margin-top m-text-bold">+ {{ item.source }}</div>
                        <div class="m-margin-top">{{ item.content }}</div>
                        <div class="m-margin-top m-text-align-center">
                            <i class="el-icon-s-opportunity"></i> {{ item.favourNum }}
                            <i class="el-icon-chat-dot-round m-margin-left"></i> {{ item.commentNum }}
                        </div>
                    </el-card>

                    <!--                    <div class="item" :style="item.style">-->
                    <!--                        {{ item.content }}-->
                    <!--                    </div>-->
                    <!--                    <div class="item" :style="item.style" :index="item.index" v-for="sentence in sentenceList" :key="sentence">-->
                    <!--                        {{ sentence.content }}-->
                    <!--                    </div>-->
                </waterfall-slot>
            </waterfall>
        </div>

        <div class="m-margin-top-big m-text-align-right m-margin-bottom-big">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageNo"
                    :page-sizes="[10, 20, 50]"
                    :page-size="10"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="sentenceList.length">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import Main from "@/components/main";
    import Waterfall from 'vue-waterfall/lib/waterfall'
    import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot'

    export default {
        components: {
            Main,
            Waterfall,
            WaterfallSlot
        },
        data() {
            return {
                range: '0',
                sentenceList: [],

                pageSize: 10,
                pageNo: 1,

                align: 'center',
                items: [],
                isBusy: false
            };
        },
        created() {
            this.getSentence();
            this.getItem(100);
        },
        methods: {
            handleClick() {
                this.getSentence();
            },
            getSentence() {
                this.$http.get('/micro-sentence?range=1')
                    .then(function (response) {
                        this.sentenceList = response.data.data;
                        console.log("this.sentenceList ==> ", this.sentenceList);

                        var lastIndex = 0;
                        for (var i = 0; i < this.sentenceList.length; i++) {
                            this.items[i] = {
                                index: lastIndex++,
                                style: {
                                    background: this.getRandomColor()
                                },
                                width: 50 + ~~(Math.random() * 50),
                                height: 10 + ~~(Math.random() * 50),
                                content: this.sentenceList[i].content,
                                category: this.sentenceList[i].category,
                                source: this.sentenceList[i].source,
                                favourNum: this.sentenceList[i].favourNum,
                                commentNum: this.sentenceList[i].commentNum,
                            }
                        }
                        console.log("this.items ==> ", this.items);
                    }.bind(this));
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pageSize = val;
                // this.getTodoList();
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.pageNo = val;
                // this.getTodoList();
            },

            getItem(count) {
                var items = [], i;
                var lastIndex = 0;
                for (i = 0; i < count; i++) {
                    items[i] = {
                        index: lastIndex++,
                        style: {
                            background: this.getRandomColor()
                        },
                        width: 100 + ~~(Math.random() * 50),
                        height: 100 + ~~(Math.random() * 50)
                    }
                }
                this.items = items;
            },
            getRandomColor() {
                var colors = [
                    'rgba(21,174,103,.5)',
                    'rgba(245,163,59,.5)',
                    'rgba(255,230,135,.5)',
                    'rgba(194,217,78,.5)',
                    'rgba(195,123,177,.5)',
                    'rgba(125,205,244,.5)'
                ];
                return colors[~~(Math.random() * colors.length)]
            },
            reflowed() {
                console.log('reflowed');
            }
        }
    }
</script>

<style scoped>
    body {
        margin: 5px;
        font-family: Helvetica, sans-serif;
    }

    .item {
        position: absolute;
        top: 5px;
        left: 5px;
        right: 5px;
        bottom: 5px;
        font-size: 1.2em;
        color: rgb(0, 158, 107);
    }

    .item:after {
        content: attr(index);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        -webkit-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
    }

    .wf-transition {
        transition: opacity .3s ease;
        -webkit-transition: opacity .3s ease;
    }

    .wf-enter {
        opacity: 0;
    }
</style>
