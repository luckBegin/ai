import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'login',
		component: () => import(/* webpackChunkName: "about" */ '../views/login.vue')
	},	{
		path: '/main',
		name: 'main',
		component: () => import(/* webpackChunkName: "about" */ '../App.vue'),
		children: [
			{
				path: '',
				name: "dialog",
				component: import(/* webpackChunkName: "about" */ '../views/dialog.vue'),
			}
		]
	}
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
})

export default router
