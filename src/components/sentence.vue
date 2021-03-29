<template>
    <div id="sentence" class="sentence">
        <Main :menuIndex="'3'"/>

        <el-row>
            <el-col :span="5" class="m-padding">
                <div class="m-flex">
                    <div><i class="el-icon-price-tag"></i> 标签</div>
                    <el-tag class="m-cursor m-text-align-right" @click="dialogFormVisible = true">新增</el-tag>
                </div>

                <div class="div-tag-item">
                    <el-tag class="m-margin-right m-cursor" @click="getSentence('')">ALL</el-tag>

                    <el-tag type="success" v-for="tag in sentenceDetails.tags" :key="tag"
                            class="m-margin-right m-cursor" @click="getSentence(tag)"># {{ tag }} #
                    </el-tag>
                </div>
            </el-col>

            <el-col :span="14" class="container-water-fall">
                <waterfall :col="col" :data="sentences" @loadmore="loadmore">

                    <div id="nice" v-for="(sentence, index) in sentences" :key="index">
                        <blockquote>
                            <div class="m-flex">
                                <div>
                                    <el-tag type="success" size="mini" v-for="tag in sentence.tags" :key="tag">#{{ tag }}#</el-tag>
                                </div>

                                <div>
                                    <i class="el-icon-edit m-cursor"></i>
                                    <el-popconfirm title="确定删除吗？" @onConfirm="deleteItem(sentence.id)">
                                        <i slot="reference"
                                           class="el-icon-delete m-margin-left m-color-red m-cursor"></i>
                                    </el-popconfirm>
                                </div>
                            </div>

                            <div class="m-margin-top-small m-flex">
                                <span class="m-text-bold m-color-teal">+ 《{{ sentence.source }}》</span>
                                <span class="m-color-teal">{{ sentence.author }}</span>
                            </div>

                            <div class="text-content" v-html="sentence.content"></div>
                        </blockquote>
                    </div>
                </waterfall>
            </el-col>

            <el-col :span="5" class="m-padding">
                <div><i class="el-icon-price-tag"></i> 目录</div>

                <ol style="line-height: 2em; margin-top: 1em">
                    <li v-for="title in sentenceDetails.titles" :key="title">{{ title }}</li>
                </ol>
                <!--                <div >{{ title }}</div>-->
            </el-col>
        </el-row>

        <el-dialog title="新增佳句" :visible.sync="dialogFormVisible">
            <el-form :model="sentence">
                <!--标签-->
                <el-tag
                        :key="tag"
                        v-for="tag in sentence.tags"
                        closable
                        :disable-transitions="false"
                        @close="handleClose(tag)">
                    {{tag}}
                </el-tag>
                <el-input
                        class="input-new-tag"
                        v-if="inputVisible"
                        v-model="inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>

                <el-row :gutter="20" class="m-margin-top">
                    <el-col :span="12">
                        <el-form-item label="来源" :label-width="formLabelWidth">
                            <el-input v-model="sentence.source" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="作者" :label-width="formLabelWidth">
                            <el-input v-model="sentence.author" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <el-input type="textarea" :rows="12" placeholder="请输入内容" v-model="sentence.content"></el-input>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addSentence">确 定</el-button>
            </div>
        </el-dialog>

        <loading :show="loading"/>
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
                sentenceDetails: {},

                sentences: [],
                col: 2,
                loading: false,
                sentenceTags: [],
                dialogFormVisible: false,
                sentence: {
                    tags: [],
                    source: '',
                    author: '',
                    content: '',
                },
                formLabelWidth: '40px',

                // 标签
                inputVisible: false,
                inputValue: ''
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
            this.getSentence('');
        },
        methods: {
            isShow() {
                return ~~(Math.random() * 3) > 1;
            },

            loadmore() {
                this.loading = true;
                setTimeout(() => {
                    this.sentences = this.sentences.concat(this.originData, this.originData);
                    this.loading = false;
                }, 1000);
            },

            // 佳句列表
            getSentence(tag) {
                this.loading = true;
                this.$http.get('/micro-sentence?range=' + this.range + "&tag=" + tag)
                    .then(function (response) {
                        this.sentenceDetails = response.data.data;
                        this.sentences = this.sentenceDetails.sentences;
                    }.bind(this));
                this.loading = false;
            },
            // 新增佳句
            addSentence() {
                this.$http({
                    url: '/micro-sentence',
                    method: 'post',
                    data: this.sentence,
                    header: {
                        'Content-Type': 'application/json'
                    }
                }).then(res => {
                    this.dialogFormVisible = false;
                    console.log("新增笔记：" + res.data);
                    window.location.reload();
                });
            },
            // 删除佳句
            deleteItem(id) {
                this.$http({
                    url: '/micro-sentence/' + id,
                    method: 'delete',
                }).then(res => {
                    this.$message({
                        message: '删除成功！',
                        type: 'success'
                    });
                    console.log("删除成功" + res.data);
                    window.location.reload();
                });
            },

            // 标签
            handleClose(tag) {
                this.sentence.tags.splice(this.sentence.indexOf(tag), 1);
            },
            showInput() {
                this.inputVisible = true;
                // this.$nextTick(_ => {
                //     this.$refs.saveTagInput.$refs.input.focus();
                // });
            },
            handleInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue) {
                    this.sentence.tags.push(inputValue);
                }
                this.inputVisible = false;
                this.inputValue = '';
            }
        },
    };
</script>

<style lang="less" scoped>
    .sentence {
        background: #F7F7F7;
        width: 100%;
        height: 100%;
    }

    .div-tag-item {
        margin-top: 1em;
        line-height: 3em;
    }

    .text-content {
        line-height: 1.6;
        color: #000;
        margin-top: 0.5em;
        letter-spacing: 2.5px
    }

    .el-tag + .el-tag {
        margin-left: 10px;
    }

    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }

    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }

    * {
        margin: 0;
    }

    .container-water-fall {
        padding-left: 1em;
        padding-right: 1em;

        background: #ffffff;
        // padding: 0 28px;
        /*width: 100vw;*/
        /*box-sizing: border-box;*/

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
