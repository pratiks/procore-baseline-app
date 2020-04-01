<template>
	<div class="hello">
		<button @click="authenticate('procore')">Procore Login</button>
	</div>
</template>

<script>
export default {
	methods: {
		authenticate: function(provider) {
			console.log(provider, 'clicked');
			this.$auth
				.authenticate(provider)
				.then(response => {
					console.log(response, 'this is response ');
					return response;
				})
				.catch(error => {
					console.log(error);
				});
		}
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
