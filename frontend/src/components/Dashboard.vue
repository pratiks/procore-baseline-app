<template>
	<div class="hello">
		<h2>Token</h2>
		<h6>{{ msg }}</h6>
		<p>
			This is the dashboard page
		</p>
		<h2>Dashboard</h2>
		<h3>Projects</h3>
		<div v-for="(project, index) in projects" class="projects">
			<span class="lighten">{{ project.name }}</span>
			<span class="lighten"> {{ project.display_name }}</span>
		</div>
	</div>
</template>
<script>
import { setToken, setRefreshToken, getToken } from '../utils/token';
import ProjectsService from '../api/projects.service';

const projects = new ProjectsService();

export default {
	name: 'Dashboard',
	data() {
		return {
			projects: [],
			msg: '',
			refresh: ''
		};
	},

	created() {
		if (!getToken()) {
			const urlSplit = window.location.href.split('?');
			const tokenSplit = urlSplit[1].split('&');
			const access_token = tokenSplit[0].split('=')[1];
			const refresh_token = tokenSplit[1].split('=')[1];
			//localStorage
			setToken(access_token);
			setRefreshToken(refresh_token);
			this.msg = access_token;
			console.log(`Successful login ${access_token}`);
		} else {
			this.msg = getToken();
			console.warn('already logged in!');
		}
	},
	async mounted() {
		//window.location.href = 'http://localhost:9000/Dashboard';
		console.log('pre mount')
		this.projects = await projects.getProjects('24357');
		console.log(this.projects)

		// const result = await auth.refreshToken();
		// console.log(result)
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
	margin: 40px 0 0;
}
ul {
	list-style-type: none;
	padding: 0;
}
li {
	display: inline-block;
	margin: 0 10px;
}
a {
	color: #42b983;
}
</style>
