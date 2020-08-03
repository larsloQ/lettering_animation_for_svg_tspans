// rollup.config.js
/*
*  when you want to build this for older browser (no async),
*  you need to run the bundle through babel
*/
/*jshint esversion: 6 */
import htmlTemplate from 'rollup-plugin-generate-html-template';
export default {
	input: './index.js',
	output: [
		{
			file: './dist/bundle.js',
			format: 'iife'
		}
	],
	plugins: [
		htmlTemplate({
			template: './index.html',
			target: './dist/index.html'
		})
	]
};