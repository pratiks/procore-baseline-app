import Router from 'vue-router';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';
import { getToken } from '@/utils/token';

/**
 *
 * @param to
 * @param from
 * @param next
 * @return {*}
 */
const beforeEnterGuard = (to, from, next) => {
	let isAuthenticated;
	try {
		isAuthenticated = getToken();
	} catch (error) {
		console.log('beforeEnterGuard failed with error, redirecting back to login');
		return next({ path: '/login' });
	}
	return isAuthenticated ? next() : next({ path: '/login' });
};

/**
 * constantRoutes: base page that does not have permission requirements all roles can be accessed
 */
export const constantRoutes = [
	{
		path: '*',
		redirect: '/login'
	},
	{
		path: '/',
		redirect: '/login'
	},
	{
		path: '/login',
		name: 'Login',
		component: Login
	},
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: Dashboard
	}
];

const router = new Router({ routes: constantRoutes });

export default router;
