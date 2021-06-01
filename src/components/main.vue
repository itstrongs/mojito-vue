<template>
    <div id="note" class="main-background">
        <el-row :gutter="20" v-if="!isMobile" style="padding: 0 5em">
            <el-col :span="2">
                <el-avatar :size="60" :src="userInfo.portrait"></el-avatar>
            </el-col>

            <el-col :span="10">
                <span class="m-cursor m-text-title-big" @click="toHome()">{{ userInfo.nickname }}</span>
                <div class="m-margin-top-small m-color-gray" style="font-size: 0.85em">{{ userInfo.signature }}</div>
            </el-col>

            <el-col :span="8">
                <div class="m-margin-top-big">
                    <span v-for="(item, index) in menu" :key="index" class="m-cursor m-margin-right"
                          :class="{ 'm-item-select' : activeIndex === item.id }"
                          @click="handleSelect(item.id)">{{ item.name }}</span>
                </div>
            </el-col>

            <el-col :span="4">
                <div class="m-text-align-right m-margin-top m-margin-right">
                    <el-button type="success" plain @click="logout()">{{ loginName }}</el-button>
                </div>
            </el-col>
        </el-row>

        <div v-if="isMobile" class="div-title">
            <el-row :gutter="5">
                <el-col :span="5">
                    <el-avatar :size="60" :src="userInfo.portrait"></el-avatar>
                </el-col>

                <el-col :span="15">
                    <span class="m-cursor m-text-title-big" @click="toHome()">{{ userInfo.nickname }}</span>
                    <div class="m-margin-top-small m-color-gray" style="font-size: 0.85em">{{ userInfo.signature }}</div>
                </el-col>

                <el-col :span="4">
                    <div class="m-text-align-right m-margin-top m-margin-right-small">
                        <el-button type="success" plain @click="logout()" size="mini">{{ loginName }}</el-button>
                    </div>
                </el-col>
            </el-row>

            <div class="m-flex-parent">
                <span v-for="(item, index) in menu" :key="index" class="m-cursor m-flex-child m-text-align-center"
                      :class="{ 'm-item-select' : activeIndex === item.id }" @click="handleSelect(item.id)">{{ item.name }}</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "note",
        data() {
            return {
                activeIndex: '0',
                userInfo: {
                    nickname: localStorage.getItem("userName") ? localStorage.getItem("userName") : 'Mojito',
                    signature: localStorage.getItem("signature") ? localStorage.getItem("signature") : '给时光以生命，给岁月以文明。',
                    portrait: localStorage.getItem("portrait") ? localStorage.getItem("portrait") : 'http://cdn.liufengqiang.com/FmdZV3IptUDq9pYyP8iVlMPOw2tI'
                },
                loginName: '',
                menu: [
                    {id: '0', name: '开发'},
                    {id: '1', name: '生活'},
                    {id: '2', name: 'todo'},
                    {id: '3', name: '其他'},
                ],
                isMobile: false,
            }
        },
        created: function () {
            this.activeIndex = this.menuIndex;
            this.loginName = localStorage.getItem('Authorization') ? "注销" : "登录";
        },
        mounted() {
            this.isMobile = this.$AppUtils.isMobile();
        },
        props: {
            menuIndex: String,
        },
        methods: {
            handleSelect(key) {
                this.activeIndex = key;
                let url;
                if (this.$route.params.userId === undefined) {
                    url = '';
                } else {
                    url = this.$route.params.userId ? '/' + this.$route.params.userId : '';
                }
                if (key === '2') {
                    this.$router.push({path: `${url}/todo`})
                } else if (key === '3') {
                    this.$router.push({path: `${url}/tools`})
                } else {
                    this.$router.push({path: `${url}/note`, query: {type: key}});
                    window.location.reload();
                }
            },
            toHome() {
                this.$router.push({path: '/'})
            },
            logout() {
                if (localStorage.getItem('Authorization')) {
                    localStorage.removeItem('Authorization');
                    localStorage.removeItem('userId');
                    this.$message({
                        message: '退出成功',
                        type: 'success'
                    });
                    window.location.reload();
                } else {
                    this.$router.push('/login');
                }
            },
        }
    }
</script>

<style scoped>
    .main-background {
        background: rgba(204, 204, 204, 0.5);
        padding: 0.75em;
    }
    .div-title {
        /*background: #ff6666;*/
    }
</style>
