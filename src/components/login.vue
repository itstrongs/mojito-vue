<template>
    <div id="login">
        <el-card shadow="always" style="background: rgba(255, 255, 255, 0.9)">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px"
                     class="demo-ruleForm">
                <el-form-item label="用户名" prop="pass" class="m-margin-top-large">
                    <el-input v-model="ruleForm.mobileNo" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="密码" prop="checkPass">
                    <el-input type="password" v-model="ruleForm.verifyCode" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button class="m-margin-left-big" type="primary" @click="submitForm('ruleForm')" :loading="loading">登录</el-button>
                    <el-button class="m-margin-left-big" @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import {mapMutations} from 'vuex';

    export default {
        data() {
            const validateUsername = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入用户名'));
                } else {
                    if (this.ruleForm.mobileNo !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    callback();
                }
            };

            const validatePassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else if (value !== this.ruleForm.verifyCode) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };

            return {
                loading: false,
                ruleForm: {
                    mobileNo: '',
                    verifyCode: '',
                },

                rules: {
                    username: [
                        {validator: validateUsername, trigger: 'blur'}
                    ],
                    password: [
                        {validator: validatePassword, trigger: 'blur'}
                    ],
                },
            };
        },
        methods: {
            ...mapMutations(['changeLogin']),

            submitForm(formName) {
                this.loading = true;

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let _this = this;
                        if (this.ruleForm.mobileNo === '' || this.ruleForm.verifyCode === '') {
                            alert('手机号或验证码不能为空');
                        } else {
                            this.$http({
                                method: 'post',
                                url: '/user/login',
                                data: _this.ruleForm
                            }).then(res => {
                                this.loading = false;
                                _this.userToken = res.data.data.authorization;
                                // 将用户token保存到vuex中
                                _this.changeLogin({Authorization: _this.userToken});
                                localStorage.setItem("userId", res.data.data.id);
                                localStorage.setItem("userName", res.data.data.nickname);
                                localStorage.setItem("portrait", res.data.data.portrait);
                                localStorage.setItem("signature", res.data.data.signature);
                                // _this.$router.push('/note');

                                this.$message({
                                    message: '登录成功',
                                    type: 'success'
                                });

                                _this.$router.push({path: `/${res.data.data.id}/note`});
                            }).catch(error => {
                                alert('账号或密码错误');
                                console.log(error);
                                this.loading = false;
                            });
                        }
                    } else {
                        this.loading = false;
                        console.log('error submit!!');
                        return false;
                    }
                })
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
        }
    };
</script>

<style>
    #login {
        width: 40em;
        margin: 200px auto;
    }
</style>
