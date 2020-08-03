/*jshint esversion: 6 */
import {
	letterByLetterLineByLine,
	setDxToTspans
} from './larslo_animation_lib/lettering.js';

import {
	animateAttribute
} from './larslo_animation_lib/svgAttribute.js';

window.addEventListener('load', () => {

	/* DOM selectors*/
	const svg = document.querySelector('#texts');
	if (!svg) return;
	const texts = svg.querySelectorAll('text');

	function resetAnim() {
		texts.forEach((el) => {
			/* prepare texts (tspans) for lettering animation*/
			setDxToTspans(el, 1000);
		});
	}

    /* animation are far from beauty, but chainable :-) */
	function animate() {
		letterByLetterLineByLine(texts[0], 10).then(() => {
			/* scale text down*/
			animateAttribute( 'font-size', 26, 10,texts[0],0.3, 30,'easeInOutQuart');
			const ts = texts[0].querySelectorAll('tspan');
			/* adjsut line spacing*/
			animateAttribute('y', 52, 20, ts[1], 0.5, 25, 'easeInOutQuart').then(
				() => {
					/*do it again */
					resetAnim();
					letterByLetterLineByLine(texts[0], 50);
				}
			);
		});
	}

	/* just testing the difference between the easings */
	function doRects(){
		const rects = svg.querySelectorAll('rect');
		animateAttribute( 'width', 10, 200,  rects[0],  2,  20,  'easeOutQuart');
		animateAttribute( 'width', 10, 200,  rects[1],  2,  20,  'easeOutCubic');
		animateAttribute( 'width', 10, 200,  rects[2],  2,  20,  'easeInElastic').then(() => {
			doRects();
		});
	}

	/*run animation*/
	resetAnim();
	animate();
	doRects();
});
