<template>
	<div id="app">
		<div id="nav">
			<router-link to="/Login">Login Page</router-link>
			<h3>Template Application</h3>
			<router-view></router-view>
			<p>Login to procore first, then your redirected to your app!</p>
		</div>
	</div>
</template>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

#nav {
	padding: 30px;
}

#nav a {
	font-weight: bold;
	color: #2c3e50;
}

#nav a.router-link-exact-active {
	color: #42b983;
}
</style>
