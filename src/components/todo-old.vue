<template>
    <div id="todo" class="m-container m-background-body">
        <Main :menuIndex="'1'"></Main>

        <el-row :gutter="20">
            <el-col :span="18">
                <div class="m-margin-top">
                    <el-link class="m-text-bold" @click="getTodoByCategory('', '')">首页</el-link>  <i class="el-icon-arrow-right"></i>  {{ categoryName }}
                    <el-button type="primary" plain size="mini" @click="showDialog()" class="m-float-right">新增</el-button>
                </div>
            </el-col>
        </el-row>

        <el-dialog title="新增TODO" :visible.sync="dialogFormVisible">
            <el-form :model="currentTodo">
                <el-form-item label="内容" label-width="120px">
                    <el-input v-model="currentTodo.content" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="分类" label-width="120px">
                    <el-select v-model="currentTodo.categoryName" placeholder="请选择类型" filterable allow-create default-first-option>
                        <el-option :label="type.name" :value="type.name" v-for="(type, index) in categoryList" :key="index"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addTodo">确 定</el-button>
            </div>
        </el-dialog>

        <el-row :gutter="20">
            <el-col :span="18">
                <el-card class="box-card m-margin-top" v-for="(todo, index) in todoList.content" :key="index">
                    <div class="text item" v-bind:class="{'m-text-decoration': todo.isFinish }">
                        <el-tag v-if="todo.isSetTop" type="danger" size="mini" class="m-margin-right"><i class="el-icon-top"></i></el-tag>
                        <span class="m-text-bold">{{ index+1 }}. {{ todo.content }}</span>
                    </div>

                    <div class="m-float-right">
                        <div><el-button size="mini" type="success" plain @click="getCategoryById(todo.categoryId, todo.categoryName)">{{ todo.categoryName }}</el-button></div>
                    </div>

                    <div class="m-margin-top-small">
                        <span class="m-text-tip m-margin-right-mini m-margin-top"><i class="el-icon-date m-margin-top"></i> {{ todo.updatedAt }}</span>

                        <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                            <el-button type="primary" icon="el-icon-edit" circle plain size="mini" @click="alertTodo(index)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="置顶" placement="bottom">
                            <el-button type="info" icon="el-icon-top" circle plain size="mini" @click="updateTodo(index, !todo.isSetTop, todo.isFinish)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="完成" placement="bottom">
                            <el-button type="warning" icon="el-icon-finished" circle plain size="mini" @click="updateTodo(index, todo.isSetTop, !todo.isFinish)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                            <el-popconfirm title="确定删除吗？" @onConfirm="deleteTodo(todo.id)">
                                <el-button type="danger" icon="el-icon-delete" circle plain size="mini" slot="reference" class="m-margin-left"></el-button>
                            </el-popconfirm>
                        </el-tooltip>
                    </div>
                </el-card>

                <div class="m-margin-top-big m-text-align-right m-margin-bottom-big">
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="pageNo"
                            :page-sizes="[10, 20, 50]"
                            :page-size="10"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="todoList.totalElements">
                    </el-pagination>
                </div>
            </el-col>

            <el-col :span="6" class="m-margin-top">
                <el-card>
                    <div class="m-text-content-large"><i class="el-icon-folder"></i> 分类</div>
                    <el-divider></el-divider>
                    <div v-for="(category, index) in categoryList" :key="index" class="m-margin-top-big">
                        <el-link @click="getCategoryById(category.id, category.name)" v-bind:class="{ 'm-teal-big' : categoryId === category.id }">{{ category.name }}  {{ category.num }}</el-link>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import Main from "@/components/main";

    export default {
        name: "todo",
        components: {Main},
        data() {
            return {
                todoList: {},
                categoryList: [],
                dialogFormVisible: false,

                currentTodo: {},

                categoryId: '',
                categoryName: '',

                pageSize: 10,
                pageNo: 1,
            }
        },
        created() {
            this.userId = this.$route.params.userId ? this.$route.params.userId : '';
            this.getCategoryList();
        },
        methods: {
            // 获取分类列表
            getCategoryList() {
                this.$http.get('/category?moduleType=1&userId=' + this.userId, {
                    params: {}
                }).then(function (response) {
                    this.categoryList = response.data.data;
                    this.categoryId = this.categoryList[0].id;
                    this.categoryName = this.categoryList[0].name;
                    this.getTodoList();
                }.bind(this));
            },
            // 获取todo列表
            getTodoList() {
                this.$http.get('/todo-plan/list?categoryId=' + this.categoryId + "&pageSize=" + this.pageSize + "&pageNo=" + this.pageNo, {
                    params: {}
                }).then(function (response) {
                    this.todoList = response.data.data;
                }.bind(this));
            },
            // 新增/修改todo
            addTodo() {
                this.dialogFormVisible = false;
                this.$http({
                    url: '/todo-plan',
                    method: 'post',
                    data: this.currentTodo,
                    header: {
                        'Content-Type': 'application/json'
                    }
                }).then(res => {
                    console.log("新增todo：" + res.data)
                    this.getTodoList();
                });
            },
            // 删除todo
            deleteTodo(id) {
                this.$http({
                    url: '/todo-plan/' + id,
                    method: 'delete',
                }).then(res => {
                    console.log("删除成功" + res.data);
                    this.getTodoList();
                });
            },

            getCategoryById(categoryId, categoryName) {
                this.categoryId = categoryId;
                this.categoryName = categoryName;
                this.getTodoList();
            },
            updateTodo2(index, isSetTop, isFinish) {
                this.currentTodo = this.todoList.content[index];
                this.currentTodo.isSetTop = isSetTop;
                this.currentTodo.isFinish = isFinish;
                this.addTodo();

            },
            alertTodo(index) {
                this.dialogFormVisible = true;
                this.currentTodo = this.todoList.content[index];
            },
            showDialog() {
                this.dialogFormVisible = true;
                this.currentTodo = {};
                // this.currentTodo.categoryName = this.categoryName;
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pageSize = val;
                this.getTodoList();
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.pageNo = val;
                this.getTodoList();
            }
        }
    }
</script>
