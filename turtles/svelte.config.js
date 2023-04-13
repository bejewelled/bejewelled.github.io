
import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-vercel';


/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
	    preprocess({
	      postcss: true,
	    }),
  ],

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: null,
			precompress: false
		}),
		appDir: 'app',
		prerender: {
			default: true,
		},
		trailingSlash: 'always',
		paths: {
			base: '/bejewelled.github.io'
		}
	}
};

export default config;
