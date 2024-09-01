import {createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw} from 'vue-router'
const routes: Array<RouteRecordRaw> = [
	{
		path: '/login',
		name: 'login',
		component: () => import(/* webpackChunkName: "about" */ '../views/login.vue')
	},	{
		path: '/',
		name: 'main',
		component: () => import(/* webpackChunkName: "about" */ '../views/dialog.vue'),
		beforeEnter: (to,from,next) => {
			const t = localStorage.getItem('token')
			return t ? next() : next('/login');
		},
	}
]

const router = createRouter({
	history: createWebHashHistory(process.env.BASE_URL),
	routes
})

export default router
