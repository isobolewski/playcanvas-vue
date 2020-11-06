import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/playcanvas',
    name: 'PlayCanvas',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "playcanvas" */ '../views/PlayCanvas.vue'),
    props: { sceneName: 'basic' },
  },
  {
    path: '/physics',
    name: 'Physics',
    component: () => import(/* webpackChunkName: "physics" */ '../views/Physics.vue'),
    props: { sceneName: 'physicsCubes' },
  },
  {
    path: '/tween',
    name: 'TweenJS',
    component: () => import(/* webpackChunkName: "tween" */ '../views/Tween.vue'),
    props: { sceneName: 'tween' },
  },
]

const router = new VueRouter({
  routes
})

export default router
