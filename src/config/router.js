import Vue from 'vue';
import Router from 'vue-router';

import login from '@/components/login';
import sentence from '@/components/sentence';
import PhotoWall from '@/components/photo-wall';
import navigation from '@/components/navigation';
import timeMachine from '@/components/time-machine';
import cloudDisk from '@/components/cloud-disk';
import tools from '@/components/tools';
import video from '@/components/video';

import note from '@/components/note';
import noteEdit from '@/components/note-edit';
import noteOld from '@/components/note-old';
import todo from '@/components/todo';
import todoOld from '@/components/todo-old';

import Learn from '@/components/learn/learn-element';
import Demo01 from '@/components/learn/demo-01';
import Demo02 from '@/components/learn/demo-02';
import Demo03 from '@/components/learn/waterfall';
import container from '@/components/learn/container';
import demo from '@/components/demo';
import test from '@/components/test';

Vue.use(Router);

//在路由跳转的时候同一个路由多次添加是不被允许的
//重写路由的push方法
const VueRouterPush = Router.prototype.push;
Router.prototype.push = function push(to) {
    return VueRouterPush.call(this, to).catch(err => err)
};

const router = new Router({
    // mode: 'history',
    routes: [
        {path: '/login', name: 'login', component: login, meta: {title: '登录'}},
        {path: '/nav', name: 'navigation', component: navigation, meta: {title: '导航栏'}},
        {path: '/sentence', name: 'sentence', component: sentence, meta: {title: '佳句'}},
        {path: '/:userId/sentence', name: 'sentence', component: sentence, meta: {title: '佳句'}},
        {path: '/photo-wall', name: 'photoWall', component: PhotoWall, meta: {title: '照片墙'}},
        {path: '/:userId/photo-wall', name: 'photoWall', component: PhotoWall, meta: {title: '照片墙'}},
        {path: '/time-machine', name: 'timeMachine', component: timeMachine, meta: {title: '时光机'}},
        {path: '/cloud-disk', name: 'cloudDisk', component: cloudDisk, meta: {title: '云盘'}},
        {path: '/tools', name: 'tools', component: tools, meta: {title: '工具'}},
        {path: '/video', name: 'video', component: video, meta: {title: '视频解析'}},

        {path: '/', name: 'note', component: note, meta: {title: 'Mojito'}},
        {path: '/note', name: 'note', component: note, meta: {title: 'Mojito'}},
        {path: '/note-old', name: 'noteOld', component: noteOld, meta: {title: 'Mojito'}},
        {path: '/:userId/note', name: 'note', component: note, meta: {title: 'Mojito'}},
        {path: '/:userId/note/category/:categoryId', name: 'note', component: note, meta: {title: 'Mojito'}},
        {path: '/note/:id', name: 'note', component: note, meta: {title: 'Mojito'}},
        {path: '/:userId/note/:id', name: 'note', component: note, meta: {title: 'Mojito'}},
        {path: '/note-edit', name: 'noteEdit', component: noteEdit, meta: {title: 'Mojito'}},

        {path: '/todo', name: 'todo', component: todo, meta: {title: '计划'}},
        {path: '/todo-old', name: 'todoOld', component: todoOld, meta: {title: '计划'}},
        {path: '/:userId/todo', name: 'todo', component: todo, meta: {title: '计划'}},

        {path: '/learn', name: 'Learn', component: Learn},
        {path: '/demo/01', name: 'Demo01', component: Demo01},
        {path: '/demo/02', name: 'Demo02', component: Demo02},
        {path: '/demo/03', name: 'Demo03', component: Demo03},
        {path: '/test', name: 'test', component: test},
        {path: '/demo', name: 'demo', component: demo},
        {path: '/learn/container', name: 'container', component: container},
        {path: '/test', name: 'test', component: test},
    ]
});

// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        next();
    } else {
        // let token = localStorage.getItem('Authorization');
        //
        // if (token === 'null' || token === '') {
        //     next('/login');
        // } else {
            next();
        // }
    }
});

export default router;
