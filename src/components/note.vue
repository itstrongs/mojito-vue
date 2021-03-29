<template>
    <div class="note-background">
        <div>
            <Main :menuIndex="noteType"/>
        </div>

        <el-image v-if="notePictureIsShow" :src="noteDetails.picture" fit="cover" class="note-picture"
                  style="padding-bottom: 0"></el-image>

        <el-row>
            <!--归档-->
            <el-col :span="5" v-if="!this.isMobile">
                <div class="m-padding-big">
                    <div class="m-text-size">
                        <i class="el-icon-folder"></i><span class="m-margin-left">归档</span>
                        <el-button type="primary" plain size="mini" @click="showDialog()"
                                   class="m-margin-left-large">新增
                        </el-button>
                    </div>

                    <el-input placeholder="搜索" prefix-icon="el-icon-search" size="small" @change="getNoteList()"
                              v-model="search" clearable class="m-margin-top"></el-input>

                    <div class="m-margin-top">
                        <el-tree class="category m-background-transparent" :data="noteList" node-key="id"
                                 :props="defaultProps" :default-expanded-keys="[categoryId]"
                                 :highlight-current="true" @node-click="handleNodeClick" :default-expand-all="true">
                                <span class="custom-tree-node" slot-scope="{ node, data }">
                                <span>{{ node.label }}</span>
                                    <el-tag v-if="data.isSetTop" type="danger" size="mini"
                                            class="m-margin-left-small"><i class="el-icon-top"></i></el-tag>
                                    <el-tag v-if="data.permission === 2" type="danger" size="mini"
                                            class="m-margin-left-small">私</el-tag>
                              </span>
                        </el-tree>
                    </div>
                </div>
            </el-col>

            <!--笔记-->
            <el-col :span="this.isMobile ? 24 : 14" class="div-note">
                <div class="container-note m-padding">
                    <div class="m-text-align-center"><span class="m-text-title-big">{{ noteDetails.name }}</span>
                    </div>

                    <span class="m-margin-right m-text-bold" v-if="this.isMobile" @click="drawer = true">分类</span>
                    <span class="m-text-tip"><i class="el-icon-date m-margin-top"></i> {{ noteDetails.createdAt }}</span>
                    <i class="el-icon-folder m-margin-left"></i> {{ noteDetails.category }}

                    <el-drawer
                            :visible.sync="drawer"
                            :with-header="false"
                            :direction="direction"
                            size="60">
                        <!--归档-->
                        <div class="m-padding-big category-drawer">
                            <div class="m-text-size">
                                <i class="el-icon-folder"></i><span class="m-margin-left">归档</span>
                                <el-button type="primary" plain size="mini" @click="showDialog()"
                                           class="m-margin-left-large">新增
                                </el-button>
                            </div>

                            <el-input placeholder="搜索" prefix-icon="el-icon-search" size="small"
                                      @change="getNoteList()" v-model="search" clearable
                                      class="m-margin-top"></el-input>

                            <div class="m-margin-top">
                                <el-tree class="category m-background-transparent" :data="noteList" node-key="id"
                                         :props="defaultProps" :default-expanded-keys="[categoryId]"
                                         :highlight-current="true" @node-click="handleNodeClick">
                                        <span class="custom-tree-node" slot-scope="{ node, data }">
                                            <span>{{ node.label }}</span>
                                            <span>
                                                <el-tag v-if="data.isSetTop" type="danger" size="mini"
                                                        class="m-margin-left"><i class="el-icon-top"></i></el-tag>
                                            </span>
                                        </span>
                                </el-tree>
                            </div>
                        </div>
                    </el-drawer>

                    <div class="m-float-right">
                        <el-tooltip v-if="isCurrentUser" class="item" effect="dark" content="编辑" placement="bottom">
                            <el-button type="primary" icon="el-icon-edit" circle plain size="mini"
                                       @click="updateNode()"></el-button>
                        </el-tooltip>

                        <el-tooltip v-if="isCurrentUser" class="item" effect="dark" content="置顶" placement="bottom">
                            <el-button type="success" icon="el-icon-top" circle plain size="mini"
                                       @click="setTopNote()"></el-button>
                        </el-tooltip>

                        <el-tooltip v-if="isCurrentUser" class="item" effect="dark" content="删除" placement="bottom">
                            <el-popconfirm title="确定删除吗？" @onConfirm="deleteNote()">
                                <el-button type="danger" icon="el-icon-delete" circle plain size="mini" slot="reference"
                                           class="m-margin-left"></el-button>
                            </el-popconfirm>
                        </el-tooltip>

<!--                        <span class="m-margin-left" v-if="this.isMobile">目录</span>-->
                    </div>

                    <div v-html="noteDetails.contentHtml" id="nice"
                         class="js-toc-content m-margin-bottom-big m-margin-top"></div>
                </div>
            </el-col>

            <!--目录-->
            <el-col :span="5" v-if="!this.isMobile">
                <div class="m-padding-big">
                    <div class="m-text-content-large">
                        <i class="el-icon-folder"></i><span class="m-margin-left">目录</span>
                    </div>

                    <el-divider></el-divider>

                    <div class="toc">
                        <ul class="js-toc"></ul>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import Main from "@/components/main";
    import * as tocbot from 'tocbot';

    export default {
        name: "note-details",
        components: {Main},
        data() {
            return {
                // 笔记详情
                noteDetails: {},
                // 要更新的笔记
                updateNote: {},
                // 笔记列表
                noteList: [],

                categoryId: '',
                search: '',

                userId: '',
                noteType: '0',
                isCurrentUser: false,
                permission: [{"name": "公开", "value": 0}, {"name": "匿名", "value": 1}, {"name": "私有", "value": 2}],

                htmlStr: '',

                defaultProps: {
                    children: 'notes',
                    label: 'name'
                },

                notePictureIsShow: false,
                isRequestNote: false,

                isMobile: false,
                drawer: false,
                direction: 'ltr',
            }
        },
        created() {
            this.init();
            this.getNote(this.$route.params.id);
        },
        mounted() {
            this.isMobile = this.$AppUtils.isMobile();
        },
        methods: {
            init() {
                this.noteType = this.$route.query.type ? this.$route.query.type : '0';
                console.log("this.noteType11==", this.noteType);

                // 当前页面用户id
                this.userId = this.$route.params.userId ? this.$route.params.userId : '1';
                this.isCurrentUser = this.userId === localStorage.getItem("userId");
            },

            // 笔记详情
            getNote(noteId) {
                console.log("noteId", noteId);
                if (noteId && !this.isRequestNote) {
                    this.isRequestNote = true;
                    this.$http.get('/note/' + noteId, {
                        params: {}
                    }).then(function (response) {
                        this.noteDetails = response.data.data;
                        document.title = this.noteDetails.name;
                        this.categoryId = this.noteDetails.categoryId;
                        this.noteType = this.noteDetails.noteType;
                        console.log("this.noteType22==", this.noteType);
                        if (this.noteDetails.picture !== null) {
                            this.notePictureIsShow = true;
                        }
                        this.getNoteList();

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
                                scrollEndCallback: function (e) { //回调函数
                                    console.log(e);
                                    // window.scrollTo(window.scrollX, window.scrollY - 10);
                                    //修正滚动后页面的位置，80 是自己顶部栏的高度
                                },
                            });
                        })
                    }.bind(this));
                } else {
                    this.getNoteList();
                }
            },
            // 笔记列表
            getNoteList() {
                this.$http.get('/note?userId=' + this.userId + '&search=' + this.search + "&noteType=" + this.noteType, {
                    params: {}
                }).then(function (response) {
                    if (response.data.code === 200) {
                        this.noteList = response.data.data;
                        if (!this.isRequestNote) {
                            this.getNote(this.noteList[0].notes[0].id);
                        }
                    } else {
                        this.$message.error(response.data.msg);
                    }
                }.bind(this));
            },
            // 新增/修改笔记
            saveNote() {
                console.log("新增/修改笔记: ", this.updateNote);
                this.$http({
                    url: '/note',
                    method: 'post',
                    data: this.updateNote,
                    header: {
                        'Content-Type': 'application/json'
                    }
                }).then(res => {
                    console.log("新增笔记：" + res.data);
                    window.location.reload();
                });
            },
            // 更新笔记
            updateNode() {
                this.$router.push({
                    path: '/note-edit',
                    query: {id: this.noteDetails.id}
                });
            },
            // 删除笔记
            deleteNote() {
                console.log("deleteNote");
                this.$http({
                    url: '/note/' + this.noteDetails.id,
                    method: 'delete',
                }).then(res => {
                    this.$message({
                        message: '删除成功！',
                        type: 'success'
                    });
                    console.log("删除成功" + res.data);
                    this.$router.push({path: '/'});
                    window.location.reload();
                });
            },
            // 置顶
            setTopNote() {
                this.updateNote = this.noteDetails;
                this.updateNote.isSetTop = !this.updateNote.isSetTop;
                this.saveNote();
            },

            handleNodeClick(data) {
                if (data.notes === undefined) {
                    let url = this.$route.params.userId ? '/' + this.$route.params.userId : '';
                    this.$router.push({path: `${url}/note/${data.id}`,
                        query: {type: this.noteType}});
                    window.location.reload();
                }
            },
            showDialog() {
                if (localStorage.getItem('Authorization')) {
                    this.$router.push({
                        path: '/note-edit',
                        query: {categoryId: this.categoryId}
                    });
                } else {
                    this.$message({
                        message: '请先登录',
                        type: 'success'
                    });
                    this.$router.push('/login');
                }
            },
            setCategory(index, categoryId) {
                console.log("setCategory", index, categoryId);
                this.updateNote = this.noteDetails;
                this.updateNote.categoryId = categoryId;
                this.saveNote();
            },
        }
    }
</script>

<style lang="scss">
    @import 'node_modules/tocbot/src/scss/tocbot';

    .is-position-fixed {
        position: fixed !important;
        top: 0
    }

    .category {
        font-size: 18px;
        line-height: 1.5;
    }
</style>

<style lang="scss" scoped>
    ::v-deep {
        .toc-link {
            line-height: 2.5;
        }

        .toc::-webkit-scrollbar {
            width: 0 !important
        }
    }

    .note-background {
        background: #F7F7F7;
        width: 100%;
        height: 100%;
    }

    .note-picture {
        width: 100%;
        height: 300px;
    }

    .container-note {
        margin: auto;
        min-height: 52em;
    }

    .div-note {
        background: #ffffff;
    }

    .category-drawer {
        height: 800px;
    }
</style>

