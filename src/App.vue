<template>
	<DayPlanner />
</template>

<script>
import DayPlanner from './components/DayPlanner.vue'

export default {
  name: 'App',
  components: {
    DayPlanner
  }
}
</script>

<style>
	:root {
		--color-primary: hsl(10, 100%, 58%);
		--color-secondary: hsl(10, 98%, 38%);
		--color-gray: hsl(0, 0%, 70%);
		--color-gray-light: hsl(0, 0%, 86%);
		--color-gray-light-light: hsl(0, 0%, 90%);
		--color-gray-dark: hsl(215, 26%, 23%);
		--color-gray-dark-dark: hsl(206, 72%, 11%);
		--color-white: hsl(0, 0%, 93%);
		--color-error: hsl(4, 90%, 58%);
		--color-warning: hsl(36, 100%, 50%);
	}
	@media (prefers-color-scheme: light) {
		:root {
			--color-background: var(--color-gray-light-light);
			--color-text: var(--color-gray-dark-dark);
		}
	}

	@media (prefers-color-scheme: dark) {
		:root {
			--color-background: var(--color-gray-dark);
			--color-text: var(--color-gray-light);
		}
	}

	body {
		color: var(--color-text);
		background-color: var(--color-background);
	}
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		margin-top: 60px;
	}
</style>
