<template>
<!--    <vue-waterfall-easy :imgsArr="imgsArr" @scrollReachBottom="getData"></vue-waterfall-easy>-->
    <div style="height: 500px">
<!--        <vue-waterfall-easy :imgsArr="imgsArr" @scrollReachBottom="getData">-->
<!--            <div slot="waterfall-head">waterfall-head</div>-->
<!--        </vue-waterfall-easy>-->
        <vue-waterfall-easy :height="100" :imgsArr="imgsArr" @scrollReachBottom="getData"></vue-waterfall-easy>
    </div>
</template>

<script>
    import vueWaterfallEasy from 'vue-waterfall-easy'

    export default {
        name: "demo-01",
        data() {
            return {
                imgsArr: ['http://pic1.win4000.com/wallpaper/5/58575585dbbf1.jpg',
                'http://pic-bucket.ws.126.net/photo/0003/2020-07-26/FIG0JHVB00AJ0003NOS.jpg',
                'http://pic1.win4000.com/wallpaper/a/584ba8f74d136.jpg'],
                group: 3,// request param
            }
        },
        components: {
            vueWaterfallEasy
        },
        methods: {
            getData() {
                // axios.get('./static/mock/data.json?group=' + this.group)
                //     .then(res => {
                //         this.imgsArr = this.imgsArr.concat(res.data)
                //         this.group++
                //     })
            },
        },
        created() {
            console.log("demo-01");
            this.getData()
        }
    }
</script>

<style scoped>

</style>
