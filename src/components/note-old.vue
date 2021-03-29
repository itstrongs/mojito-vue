<template>
    <div id="note" class="m-container m-background-body">
        <Main :menuIndex="'0'"/>

        <el-row :gutter="20" class="m-margin-top">
            <el-col :span="19">
                <el-row :gutter="10">
                    <el-col :span="18">
                        <el-button type="primary" plain size="mini" @click="showDialog()">新增</el-button>
                        <el-button type="success" plain size="mini" @click="reload()">所有</el-button>
                    </el-col>

                    <el-col :span="6">
                        <el-input placeholder="搜索" prefix-icon="el-icon-search" size="small" @change="searchNote()" v-model="search" clearable>
                        </el-input>
                    </el-col>
                </el-row>

                <!--笔记列表-->
                <el-card class="box-card m-margin-top m-background-card" v-for="(note, index) in noteList.content" :key="index">
                    <div>
                        <el-tag v-if="note.isSetTop" type="danger" size="mini" class="m-margin-right"><i class="el-icon-top"></i></el-tag>
                        <span class="m-cursor m-text-title" @click="getNoteDetails(note.id)">{{ index + 1 }}. {{ note.name }}</span>
                        <el-tag type="danger" size="mini" class="m-margin-left"> {{ permission[note.permission].name }}</el-tag>
                    </div>

                    <el-button class="m-float-right" size="mini" type="success" plain @click="getCategoryById(note.categoryId)">{{ note.categoryName }}</el-button>

                    <div class="m-margin-top-small">
<!--                        <el-avatar src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1577012344545&di=79095a81296c54a950cbe4c8db05a10d&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201506%2F04%2F20150604214559_BKmFJ.jpeg" size="small"></el-avatar>-->
<!--                        <span class="m-teal m-margin-left">小小强者</span>-->
                        <span class="m-text-tip"><i class="el-icon-date m-margin-top"></i> {{ note.createdAt }}</span>
<!--                        <el-button class="m-float-right" size="medium" @click="getNoteDetails(note.id)">阅读全文 <i class="el-icon-d-arrow-right"></i></el-button>-->

                        <el-tooltip v-if="isSelf" class="item m-margin-left" effect="dark" content="编辑" placement="bottom">
                            <el-button type="primary" icon="el-icon-edit" circle plain size="mini" @click="alertTodo(index)"></el-button>
                        </el-tooltip>

                        <el-tooltip v-if="isSelf" class="item" effect="dark" content="置顶" placement="bottom">
                            <el-button type="success" icon="el-icon-top" circle plain size="mini" @click="setTopNote(index)"></el-button>
                        </el-tooltip>

                        <el-dropdown placement="top">
                            <el-tooltip v-if="isSelf" class="item" effect="dark" content="移动分类" placement="top">
                                <el-button type="info" icon="el-icon-notebook-1" circle plain size="mini" class="m-margin-left"></el-button>
                            </el-tooltip>

                            <el-dropdown-menu slot="dropdown">
                                <div v-for="(category, index2) in categoryList" :key="index2" @click="setCategory(index, category.id)">
                                    <el-dropdown-item :command="category.id">{{ category.name }}</el-dropdown-item>
                                </div>
                            </el-dropdown-menu>
                        </el-dropdown>

                        <el-tooltip v-if="isSelf" class="item" effect="dark" content="删除" placement="bottom">
                            <el-popconfirm title="确定删除吗？" @onConfirm="deleteNote(note.id)">
                                <el-button type="danger" icon="el-icon-delete" circle plain size="mini" slot="reference" class="m-margin-left"></el-button>
                            </el-popconfirm>
                        </el-tooltip>

                        <span class="m-text-tip m-margin-left">更新于：{{ note.updatedAt }}</span>
                    </div>
                </el-card>

                <div class="m-margin-top-big m-text-align-right m-margin-bottom-big">
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="pageNo"
                            :page-sizes="[10, 20, 50]"
                            :page-size="20"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="noteList.totalElements">
                    </el-pagination>
                </div>
            </el-col>

            <!--分类列表-->
            <el-col :span="5">
                <el-card class="m-background-card">
                    <div class="m-text-content-large">
                        <span class="m-cursor" @click="reload()"><i class="el-icon-folder"></i> 分类</span>
                    </div>
                    <el-divider></el-divider>
                    <div v-for="(category, index) in categoryList" :key="index" class="m-margin-top-big">
                        <el-link @click="getCategoryNote(category.id, category.name)" v-bind:class="{ 'm-teal-big' : categoryId === category.id }">
                            {{ category.name }}   {{ category.num }}
                        </el-link>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <!--新增对话框-->
        <el-dialog title="新增笔记" :visible.sync="dialogFormVisible" width="60%">
            <el-form :model="dialogNote">
                <el-form-item label="标题" label-width="40px">
                    <el-input v-model="dialogNote.name" autocomplete="off"></el-input>
                </el-form-item>

                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="分类" label-width="40px">
                            <el-select v-model="dialogNote.categoryName" placeholder="默认分类" filterable allow-create default-first-option>
                                <el-option :label="category.name" :value="category.name" v-for="(category, index) in categoryList" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item label="权限" label-width="40px">
                            <el-select v-model="dialogNote.permission" placeholder="默认公开" filterable allow-create default-first-option>
                                <el-option :label="item.name" :value="item.value" v-for="(item, index) in permission" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item label="日期" label-width="40px">
                            <el-date-picker v-model="dialogNote.createdAt" type="date" placeholder="默认当天">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-input type="textarea" :rows="18" placeholder="请输入内容" class="m-margin-top" v-model="dialogNote.content"></el-input>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addNote">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Main from "@/components/main";

    export default {
        name: "note",
        components: {Main},
        data() {
            return {
                categoryList: [],
                categoryId: '',
                categoryName: '',

                noteId: '',
                noteType: 0,
                noteList: {},

                pageSize: 20,
                pageNo: 1,

                dialogFormVisible: false,
                currentNote: {},

                dialogNote: {},

                permission: [{"name":"公开", "value":0}, {"name":"匿名", "value":1}, {"name":"私有", "value":2}],

                search: '',

                // 登录用户id
                loginId: '',
                // 当前页面用户id
                userId: '',
                // 是否本人
                isSelf: false,
            }
        },
        created() {
            this.loginId = localStorage.getItem('userId');
            this.userId = this.$route.params.userId ? this.$route.params.userId : localStorage.getItem('userId');
            if (this.userId === null) {
                this.userId = '1';
            }
            this.categoryId = this.$route.params.categoryId ? this.$route.params.categoryId : '';
            if (this.loginId) {
                this.isSelf = true;
            }

            this.getCategoryList();
        },
        methods: {
            // 获取分类列表
            getCategoryList() {
                this.$http.get('/category?moduleType=0&userId=' + this.userId, {
                    params: {}
                }).then(function (response) {
                    if (response.data.code === 200) {
                        this.categoryList = response.data.data;
                        // this.categoryId = this.categoryList[0].id;
                        this.categoryName = this.categoryList[0].name;
                        this.getNoteList();
                    }
                }.bind(this));
            },
            // 获取笔记列表
            getNoteList() {
                this.$http.get('/note/list?categoryId=' + this.categoryId + "&pageSize=" + this.pageSize
                    + "&pageNo=" + this.pageNo + "&userId=" + this.userId + "&search=" + this.search, {
                    params: {}
                }).then(function (response) {
                    this.noteList = response.data.data;
                }.bind(this));
            },
            // 删除笔记
            deleteNote(id) {
                this.$http({
                    url: '/note/' + id,
                    method: 'delete',
                }).then(res => {
                    console.log("删除成功" + res.data);
                    this.getNoteList();
                });
            },

            getNoteDetails(id) {
                let url = this.$route.params.userId ? '/' + this.$route.params.userId : '';
                this.$router.push({path: `${url}/note/${id}`});
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pageSize = val;
                this.getNoteList();
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.pageNo = val;
                this.getNoteList();
            },
            getCategoryById(categoryId) {
                this.categoryId = categoryId;
                this.getNoteList();
            },
            setCategoryId(categoryId) {
                this.categoryId = categoryId;
                this.getNoteList();
            },

            // 新增/修改笔记
            addNote() {
                this.$http({
                    url: '/note',
                    method: 'post',
                    data: this.dialogNote,
                    header: {
                        'Content-Type': 'application/json'
                    }
                }).then(res => {
                    console.log("新增笔记：" + res.data);
                    this.dialogFormVisible = false;
                    window.location.reload();
                });
            },
            // 置顶
            setTopNote(index) {
                this.currentNote = this.noteList.content[index];
                this.currentNote.isSetTop = !this.currentNote.isSetTop;
                this.$http({
                    url: '/note',
                    method: 'post',
                    data: this.currentNote,
                    header: {
                        'Content-Type': 'application/json'
                    }
                }).then(res => {
                    console.log("更新笔记：" + res.data);
                });
            },

            getCategoryNote(categoryId, categoryName) {
                let userId = localStorage.getItem("userId") ? localStorage.getItem("userId") : this.$route.params.userId;
                this.$router.push({path: `/${userId}/note/category/${categoryId}`});
                this.categoryId = categoryId;
                this.categoryName = categoryName;
                this.getNoteList();
            },
            showDialog() {
                if (localStorage.getItem('Authorization')) {
                    this.dialogNote = {
                        categoryName: this.categoryName
                    };
                    this.dialogFormVisible = true;
                } else {
                    this.$message({
                        message: '请先登录',
                        type: 'success'
                    });
                    this.$router.push('/login');
                }
            },
            alertTodo(index) {
                this.dialogFormVisible = true;
                this.dialogNote = this.noteList.content[index];
            },
            searchNote() {
                console.log("search==>", this.search);
                this.getNoteList();
            },
            setCategory(index, categoryId) {
                console.log("index ==> ", index);
                console.log("categoryId ==> ", categoryId);
                this.dialogNote = this.noteList.content[index];
                this.dialogNote.categoryId = categoryId;
                this.addNote();
            },
            reload() {
                window.location.reload();
            }
        }
    }
</script>
