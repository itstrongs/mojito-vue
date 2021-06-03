<template>
    <div>
        <Main :menuIndex="'2'"></Main>

        <div class="todo-new">
            <div v-if="isMobile" class="layout-2">
                <div class="layout-tool m-text-align-right">
                    <el-tooltip class="item" effect="dark" content="置顶" placement="bottom">
                        <i class="el-icon-top m-margin-right" @click="setTop()"></i>
                    </el-tooltip>

<!--                    <el-tooltip class="item" effect="dark" content="完成" placement="bottom">-->
<!--                        <i class="el-icon-finished m-margin-right" @click="updateFinish()"></i>-->
<!--                    </el-tooltip>-->

                    <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                        <i class="el-icon-delete m-margin-right" @click="deleteTodo()"></i>
                    </el-tooltip>
                </div>

                <div style="margin: 0 1em">
                    <div v-for="(todo, index2) in todoList" :key="todo" @click="changeSecondIndex(index2)" v-bind:class="{ 'select-bg-1' : secondIndex === index2 }" class="todo-item">
                        <p class="m-text-bold" v-bind:class="{'m-text-decoration': todo.isFinish }">{{ todo.title }}</p>

                        <textarea autofocus="autofocus" v-model="todo.content" class="test-content-mobile" @blur.prevent="lostFocus()"></textarea>

                        <div class="m-font-size-small">
                            <span>{{ todo.createdAt }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="todo-new" v-if="!isMobile">
            <el-row :gutter="10">
                <el-col :span="4" class="layout-1">
                    <div style="text-align: center; font-size: 1.2em">
                        <i class="el-icon-circle-plus-outline" @click="isShowAddCategory = true"></i>
                        <span class="m-margin-left">TODO</span>

                        <el-popconfirm title="确定删除当前分类吗？" @confirm="deleteCategory">
                            <el-button slot="reference" class="btn-text"><i class="el-icon-remove-outline m-margin-left"></i></el-button>
                        </el-popconfirm>
                    </div>

                    <ul>
                        <li v-for="(category, index1) in todoCategory" :key="category" @click="changeOneIndex(index1)"
                            v-bind:class="{ 'select-bg-0' : oneIndex === index1 }" class="m-margin-top-small">
                            {{ category.name }}
                        </li>
                    </ul>

                    <div v-if="isShowAddCategory" class="m-text-align-center">
                        <el-input v-model="categoryName" placeholder="新建文件夹" style="width: 150px" @keyup.enter.native="addCategory"></el-input>
                    </div>
                </el-col>

                <el-col :span="8" class="layout-2">
                    <div class="layout-tool m-text-align-right">
                        <el-tooltip class="item" effect="dark" content="置顶" placement="bottom">
                            <i class="el-icon-top m-margin-right" @click="setTop()"></i>
                        </el-tooltip>

                        <el-tooltip class="item" effect="dark" content="完成" placement="bottom">
                            <i class="el-icon-finished m-margin-right" @click="updateFinish()"></i>
                        </el-tooltip>

                        <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                            <i class="el-icon-delete m-margin-right" @click="deleteTodo()"></i>
                        </el-tooltip>
                    </div>

                    <ul>
                        <li v-for="(todo, index2) in todoList" :key="todo"
                            @click="changeSecondIndex(index2)" :class="{ 'select-bg-1' : secondIndex === index2 }">
                            <p class="m-text-bold" v-bind:class="{'m-text-decoration': todo.isFinish }">{{ todo.title }}</p>

                            <div class="m-font-size-small">
                                <span>{{ todo.createdAt }}</span>
                                <span class="m-margin-left">{{ todo.describe }}</span>
                            </div>
                        </li>
                    </ul>
                </el-col>

                <el-col :span="12" class="layout-3">
                    <div class="layout-tool">
                        <el-tooltip class="item" effect="dark" content="添加" placement="bottom">
                            <i class="el-icon-edit" @click="addTodo()"></i>
                        </el-tooltip>
                    </div>

                    <div class="m-padding">
                        <div class="m-flex-parent-center">
                            <span>标题：</span>
                            <input type="text" placeholder="标题..." class="todo-input m-flex-child" v-model="updateTodo.title">
                            <span>分类：</span>
                            <input type="text" placeholder="分类..." class="todo-input m-flex-child" v-model="updateTodo.category">
                        </div>

                        <div class="m-flex-parent-center">
                            <span>描述：</span>
                            <input type="text" placeholder="描述..." class="todo-input m-flex-child" v-model="updateTodo.description">
                        </div>

                        <div class="m-flex-parent-center">
                            <span>新增：</span>
                            <input type="text" placeholder="todos..." class="todo-input m-flex-child" v-model="updateTodo.todoPlanItem">
                            <el-button type="primary" icon="el-icon-plus" circle class="m-margin-left" @click="saveTodo()"></el-button>
                        </div>

                        <div v-for="item in currentPlanItem.todoPlanItems" :key="item" class="m-margin-top-small m-flex-parent-center select-bg-1 m-padding">
                            <i class="m-cursor" :class="item.isComplete ? 'el-icon-check' : 'el-icon-remove-outline'" @click="updateFinish(item.id)"></i>
                            <span class="m-flex-child m-margin-left" :class="{'m-text-decoration' : item.isComplete}">{{ item.content }}</span>
                            <i class="el-icon-close m-cursor" @click="deleteTodoItem(item.id)"></i>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import Main from "@/components/main";

    export default {
        name: "todo-new",
        components: {Main},
        data() {
            return {
                // 分类
                todoCategory: [],
                // 列表
                todoList: [],
                // 详情
                currentContent: '',
                // 计划项列表
                currentPlanItem: [],
                // 更新
                updateTodo: {
                    "id": 0,
                    "title": "",
                    "category": "",
                    "description": "",
                    "todoPlanItem": "",
                },

                oneIndex: 0,
                secondIndex: 0,

                isShowAddCategory: false,
                categoryName: '',
                isMobile: false,
            }
        },
        created() {
            this.getTodo();
            const textarea = document.createElement("textarea");
            textarea.addEventListener("input", function() {
                this.style.height = `${this.scrollHeight}px`;
            });
        },
        mounted() {
            this.isMobile = this.$AppUtils.isMobile();
        },
        methods: {
            getTodo() {
                this.$http.get('/todo-plan', {
                    params: {}
                }).then(function (response) {
                    this.todoCategory = response.data.data;
                    this.todoList = this.todoCategory[0].todos;
                    if (!this.todoList) {
                        this.todoList = [];
                    }
                    this.currentContent = this.todoList.length > 0 ? this.todoList[0].content : '';
                    this.currentPlanItem = this.todoList[0];

                    this.updateTodo.id = this.currentPlanItem.id;
                    this.updateTodo.title = this.currentPlanItem.title;
                    this.updateTodo.category = this.currentPlanItem.category;
                    this.updateTodo.description = this.currentPlanItem.description;
                }.bind(this));
            },
            changeOneIndex(index) {
                this.oneIndex = index;
                this.todoList = this.todoCategory[index].todos;
                if (!this.todoList) {
                    this.todoList = [];
                }
                this.currentContent = this.todoList.length > 0 ? this.todoList[0].content : '';
            },
            changeSecondIndex(index) {
                this.secondIndex = index;
                this.currentContent = this.todoList[index].content;

                this.updateTodo.id = this.currentPlanItem.id;
                this.updateTodo.title = this.currentPlanItem.title;
                this.updateTodo.category = this.currentPlanItem.category;
                this.updateTodo.description = this.currentPlanItem.description;
            },
            // lostFocus() {
            //     console.log("失去焦点...", this.currentContent);
            //     // 原始长度
            //     let sourceLength = 0;
            //     if (this.todoCategory[this.oneIndex].todos) {
            //         sourceLength = this.todoCategory[this.oneIndex].todos[this.secondIndex].content.length;
            //     }
            //     if (this.currentContent.length === 0 || this.currentContent.length === sourceLength) {
            //         console.log("内容没更新");
            //     } else {
            //         if (this.todoList) {
            //             this.updateTodo.id = this.todoList[this.secondIndex].id;
            //         }
            //         this.updateTodo.content = this.currentContent;
            //
            //         this.updateTodo.categoryId = this.todoCategory[this.oneIndex].id;
            //     }
            // },
            updateFinish(id) {
                this.$http({
                    url: '/todo-plan/item/' + id + "/is-complete",
                    method: 'put',
                }).then(res => {
                    console.log("更新成功" + res.data);
                    window.location.reload();
                });
            },
            deleteTodo() {
                this.$http({
                    url: '/todo-plan/' + this.todoList[this.secondIndex].id,
                    method: 'delete',
                }).then(res => {
                    console.log("删除成功" + res.data);
                    window.location.reload();
                });
            },
            deleteTodoItem(id) {
                this.$http({
                    url: '/todo-plan/item/' + id,
                    method: 'delete',
                }).then(res => {
                    console.log("删除成功" + res.data);
                    window.location.reload();
                });
            },
            saveTodo() {
                this.$http({
                    url: '/todo-plan',
                    method: 'post',
                    data: this.updateTodo,
                    header: {
                        'Content-Type': 'application/json'
                    }
                }).then(function (response) {
                    if (response.data.code === 200) {
                        window.location.reload();
                    } else {
                        this.$message.error(response.data.msg);
                    }
                }.bind(this));
            },
            setTop() {
            },
            addTodo() {
                this.currentContent = '';
                let todoNew = {
                    "title": "新建TODO",
                    "content": "新建文档",
                    "updatedAt": "2020-11-19"
                };
                console.log("this.todoList", this.todoList);
                this.todoList.unshift(todoNew);
                console.log("this.todoList", this.todoList);
            },
            addCategory() {
                let category = {};
                category.name = this.categoryName;
                category.moduleType = 1;
                this.$http({
                    url: '/category',
                    method: 'post',
                    data: category,
                    header: {
                        'Content-Type': 'application/json'
                    }
                }).then(res => {
                    console.log("新增分类", res.data);
                    window.location.reload();
                });
            },
            deleteCategory() {
                console.log("deleteCategory");
                this.$http({
                    url: '/category/' + this.todoCategory[this.oneIndex].id,
                    method: 'delete',
                }).then(function (response) {
                    if (response.data.code === 200) {
                        window.location.reload();
                    } else {
                        this.$message.error(response.data.msg);
                    }
                }.bind(this));
            }
        }
    }
</script>

<style scoped>
    .todo-new {
        background-color: #231F23;
        height: 100%;
        color: #D4D4D4;
    }

    ul {
        list-style: none;
    }

    li {
        padding: 0.5em 1em;
    }

    .layout-1 {
        padding: 1em;
    }

    .layout-2 {
        background-color: #1C191C;
    }

    .layout-3 {
        background-color: #171717;
        min-height: 1000px;
    }

    .layout-tool {
        background-color: #231F23;
        width: 100%;
        padding: 0.5em;
        font-size: 1.25em;
    }

    .select-bg-0 {
        background-color: #A1801D;
        border-radius: 10px;
        font-weight: bold;
    }

    .select-bg-1 {
        background-color: #363636;
        border-radius: 10px;
    }
    .test-content-mobile {
        background: transparent;
        color: #d0e4fe;
        outline: none;
        border: none;
        width: 100%;
    }
    .test-content {
        background: transparent;
        color: #d0e4fe;
        outline: none;
        border: none;
        width: 100%;
        height: 1000px;
        padding: 1em;
    }
    .btn-text {
        border: none;
        outline: none;
        background: transparent;
        font-size: 1em;
        color: #D4D4D4;
    }
    .todo-item {
        padding: 0.5em 1em;
    }
    .todo-input {
        background: transparent;
        color: #d0e4fe;
        outline: none;
        border: none;
        padding: 1em;
        width: 100%;
    }
</style>
