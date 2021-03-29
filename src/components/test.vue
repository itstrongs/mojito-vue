<template>
    <el-form ref="form" :model="note">
        <div class="note-parent">
            <div class="note-header">
                <el-row :gutter="20">
                    <el-col :span="14">
                        <el-form-item label="标题" label-width="40px">
                            <el-input v-model="note.name"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="7">
                        <el-form-item label="插图" label-width="40px">
<!--                            <input @change="uploadImage" id="uploadFileInput" type="file" accept="image/*">-->
                        </el-form-item>
                    </el-col>

                    <el-col :span="3">
                        <el-button @click="cancel">取 消</el-button>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="7">
                        <el-form-item label="分类" label-width="40px">
                            <el-select v-model="note.categoryName" placeholder="默认分类" filterable allow-create default-first-option>
<!--                                <el-option :label="category.name" :value="category.name" v-for="(category, index) in noteList" :key="index"></el-option>-->
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="7">
                        <el-form-item label="权限" label-width="40px">
                            <el-select v-model="note.permission" placeholder="默认公开" filterable allow-create default-first-option>
<!--                                <el-option :label="item.name" :value="item.value" v-for="(item, index) in permission" :key="index"></el-option>-->
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="7">
                        <el-form-item label="日期" label-width="40px">
<!--                            <el-date-picker v-model="note.createdAt" type="date" placeholder="默认当天"></el-date-picker>-->
                        </el-form-item>
                    </el-col>

                    <el-col :span="3">
                        <el-button type="primary" @click="editNote">确 定</el-button>
                    </el-col>
                </el-row>
            </div>

            <div class="note-content">
                <div class="note-left">
                    <textarea autofocus="autofocus" v-model="note.content" class="test-content" @blur.prevent="lostFocus()"></textarea>
                </div>

                <div class="note-right">
                    <div v-html="note.contentHtml" id="nice" class="js-toc-content m-margin-bottom-big m-margin-top m-margin-left-big div-note-html"></div>
                </div>
            </div>
        </div>
    </el-form>
</template>

<script>
    export default {
        name: "test",
        data() {
            return {
                note: {
                    name: '',
                    // region: '',
                    // date1: '',
                    // date2: '',
                    // delivery: false,
                    // type: [],
                    // resource: '',
                    // desc: ''
                }
            }
        },
    }
</script>

<style scoped>
</style>
