<template>
	<DayPlanner  />
</template>

<script>
import DayPlanner from './components/DayPlanner.vue'

export default {
  name: 'App',
  components: {
    DayPlanner
  },
  mounted() {
    // If it is in iframe and not in dark mode
    if (window.self !== window.top ) {
        document.body.style.width = '95%';
        if (window.matchMedia && !window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // paddong on body is sero
            document.body.style.padding = '0px';
      }
    }
  }
}
</script>

<style>
	@import url("https://fonts.googleapis.com/css2?family=Comic+Neue&display=swap");

	:root {
		--color-primary: hsl(18, 74%, 49%);
		--color-secondary: rgb(164, 193, 60);
		--color-gray: hsl(0, 0%, 70%);
		--color-gray-light: hsl(0, 0%, 86%);
		--color-gray-light-light: hsl(0, 0%, 90%);
		--color-gray-dark: hsl(0, 0%, 40%);
		--color-gray-dark-dark: hsl(206, 72%, 11%);
		--color-white: hsl(0, 0%, 100%);
		--color-error: hsl(2, 81%, 58%);
		--color-warning: hsl(36, 100%, 50%);
		--font-family: "Roboto", sans-serif;
		--padding-base: 16px;
		--padding-sm: 14px;
		--padding-lg: 16px;
		--padding-xlg: 24px;
		--padding-xxlg: 32px;
		--padding-xxxlg: 48px;
		--border-radius-base: 0.25em;

		--color-background: var(--color-white);
		--color-background-item: var(--color-gray-light);
		--color-background-item-active: var(--color-gray);
		--color-text: var(--color-gray-dark);
		--color-text-inverted: var(--color-white);
		--color-border: var(--color-gray-light);
	}

	@media (prefers-color-scheme: dark) {
		:root {
			--color-gray: #334756;
			--color-background: var(--color-gray-dark-dark);
			--color-background-item: var(--color-gray-dark);
			--color-background-item-active: var(--color-gray);
			--color-text: var(--color-gray-light);
			--color-text-inverted: var(--color-gray-dark-dark);
			--color-border: var(--color-gray-dark-dark);
		}
	}

	html {
		font-size: 100%;
	}

	body {
		color: var(--color-text);
		background-color: var(--color-background);
		font-family: "Comic Neue", cursive;
		counter-reset: section;
		padding: 1em 2em;
		margin: 0;
	}

	h2 {
		line-height: 2em;
	}

	h2::before {
		counter-increment: section;
		content: counter(section) ". ";
	}

	footer {
		padding: 0.4em 6em;
		font-size: 0.8em;
		color: var(--color-text);
		background: var(--color-background-item);
		border-radius: var(--border-radius-base);
	}

	hr {
		height: 1px;
		padding: 0;
	}

	#app {
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.text-center {
		text-align: center;
	}

	.text-error {
		color: var(--color-error);
	}

	.text-warning {
		color: var(--color-warning);
	}

	.text-muted {
		color: var(--color-gray-dark);
	}
	/* ------------ Small devices ------------ */
	@media screen and (max-width: 912px) {
		html {
			font-size: 80%;
		}
		body {
			padding: 0 1em;
		}
	}

	/* ------------ Standalone ----------------- */
	@media all and (display-mode: standalone) {
		footer {
			display: none;
		}
	}
</style>
