(function () {
	'use strict';

	/*jshint esversion: 6 */
	/*
	 *
	  svgTextElement supposed to be prepared for lettering Animation
	  call this before doing a lettering animation
	 *
	 * @param      {<type>}  svgTextElement  The svg text element, element needs to have tspan as children
	 * @param      {number}  xOffset         a far off screen starting point, in pixel, make it big e.g. 2000 or more
	 * @return     {number}  the number of chars inside the svgTextElement (counting all chars inside of all tspan children)
	 */
	function setDxToTspans(svgTextElement, xOffset) {
		let tspans = svgTextElement.querySelectorAll('tspan');
		let aaa = Array.from({ length: tspans.length }, (v, i) => i);
		let lengthTotal = 0;

		/* computing lengthTotal and prepare a dx svg attribute for animation*/
		aaa.forEach((index) => {

			/* watch out for linebreaks, and spaces in between <tspan></tspan> !
	      all character literals are taken into account
	    */
			let l = tspans[index].firstChild.length;
			lengthTotal = lengthTotal + (l - 1);
			let dx = '';
			for (let i = 0; i < l; i++) {
				let r = xOffset.toString() + ' ';
				dx = dx + r;
			}
			tspans[index].setAttributeNS(null, 'dx', dx);
		});
		return lengthTotal;
	}

	/**
	 * Having the first char with a 0 in dx
	 *
	 * @param      {<string>}  dxIn    The dx in, the dx attribute of a span element dx="0 13 13 12 ..."
	 * @return     {string}    dx      string to set attribute dx
	 */
	const shuffleZeroIntoDx = function (dxIn) {
		let dx = dxIn.split(' ');
		dx.unshift(0);
		dx.pop();
		return dx.join(' ');
	};


	/**
	 * Given a svg text element with tspan inside (required) this runs the lettering animation
	 *
	 * @param      {<type>}   svgTextElement  The svg text element
	 * @param      {<type>}   tick            The tick, in ms (small = quicker)
	 * @return     {Promise}  { resolves when whole text /all tspans  are lettered }
	 */
	function letterByLetterLineByLine(svgTextElement, tick) {
		return new Promise((resolve) => {
			let tspans = svgTextElement.querySelectorAll('tspan');
			let parentX = svgTextElement.getAttributeNS(null, 'x');
			if (!parentX) parentX = 0;

			(async function loop() {
				for (let i = 0; i < tspans.length; i++) {
					await animateLineLetterByLetter(tspans[i], tick, parentX).then(() => {
					/* do something after this line*/
					});
				}
				resolve();
			})();
		});
	}


	/**
	 * Helper function for letterByLetterLineByLine
	 * does lettering for one tspan element
	 *
	 * @param      {<type>}   tspanEl  The tspan el
	 * @param      {number}   tick      The tick, in ms (small = quicker)
	 * @param      {number}   parentX  The parent x, x value of parent text
	 * @return     {Promise}  { resolves when tspan is lettered }
	 */
	const animateLineLetterByLetter = function (tspanEl, tick, parentX) {
		return new Promise(((resolve) => {
			if (!tick) {
				tick = 100;
			}
			let textlength = tspanEl.firstChild.length;
			let counter = 0;
			if (!parentX) parentX = 0;
			let interval = setInterval(
				(length) => {
					let dx = shuffleZeroIntoDx(tspanEl.getAttributeNS(null, 'dx'));
					tspanEl.setAttributeNS(null, 'dx', dx);
					tspanEl.setAttributeNS(null, 'x', parentX);
					counter++;
					if (counter == length) {
						clearInterval(interval);
						resolve();
					}
				},
				tick,
				textlength
			);
		}));
	};

	/*jshint esversion: 6 */
	/**
	 * animate an svg attribute with setAttributeNS
	 * only linear animation type
	 * no interpolation for other than numbers (e.g. hex-colors)
	 *
	 * @param      {<type>}   attr        The attribute, e.g. stroke-width, opacity
	 * @param      {number}   start       The start value
	 * @param      {number}   stop        The stop value
	 * @param      {<type>}   svgElement  The svg element
	 * @param      {number}   step        The step, how much is added in each step
	 * @param      {<number>}   tick      The tick, in milli seconds, the time in between 'steps'
	 * @return     {Promise}  { description_of_the_return_value }
	 */
	function animateAttribute(attr, start, stop, svgElement, step, tick, easing = 'linear') {
		svgElement.setAttributeNS(null, attr, start);
		return new Promise(((resolve) => {
			const reverse = (start > stop) ? -1 : 1;
			const numOfSteps = Math.abs(start-stop)/step;
			let count = 0;
			let timer = setInterval(
				() => {
					let distanceTravlled = start + (Math.abs(start-stop) * EasingFunctions[easing](count / numOfSteps) * reverse) ;
					if (!isNaN(distanceTravlled)) { // the swing / elastique easings return NaN sometimes (guess 0.5)
						svgElement.setAttributeNS(null, attr, distanceTravlled);
					}
					if (count >= numOfSteps) {
						clearInterval(timer);
						resolve(true);
					}
					count++;
				}, tick
			);
		}));
	}

	/*
	 * bezier easing function from here
	 * https://github.com/gre/bezier-easing
	 */
	const EasingFunctions = {
		// no easing, no acceleration
		linear (t) { return t; },
		// accelerating from zero velocity
		easeInQuad (t) { return t*t; },
		// decelerating to zero velocity
		easeOutQuad (t) { return t*(2-t); },
		// acceleration until halfway, then deceleration
		easeInOutQuad (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t; },
		// accelerating from zero velocity
		easeInCubic (t) { return t*t*t; },
		// decelerating to zero velocity
		easeOutCubic (t) { return (--t)*t*t+1; },
		// acceleration until halfway, then deceleration
		easeInOutCubic (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1; },
		// accelerating from zero velocity
		easeInQuart (t) { return t*t*t*t; },
		// decelerating to zero velocity
		easeOutQuart (t) { return 1-(--t)*t*t*t; },
		// acceleration until halfway, then deceleration
		easeInOutQuart (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t; },
		// accelerating from zero velocity
		easeInQuint (t) { return t*t*t*t*t; },
		// decelerating to zero velocity
		easeOutQuint (t) { return 1+(--t)*t*t*t*t; },
		// acceleration until halfway, then deceleration
		easeInOutQuint (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t; },
		// elastic bounce effect at the beginning
		easeInElastic (t) { return (.04 - .04 / t) * Math.sin(25 * t) + 1; },
		// elastic bounce effect at the end
		easeOutElastic (t) { return .04 * t / (--t) * Math.sin(25 * t); },
		// elastic bounce effect at the beginning and end
		easeInOutElastic (t) { return (t -= .5) < 0 ? (.01 + .01 / t) * Math.sin(50 * t) : (.02 - .01 / t) * Math.sin(50 * t) + 1; }
	};

	/*jshint esversion: 6 */

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

		resetAnim();

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

		function doRects(){
			const rects = svg.querySelectorAll('rect');
			animateAttribute( 'width', 10, 200,  rects[0],  2,  20,  'easeOutQuart');
			animateAttribute( 'width', 10, 200,  rects[1],  2,  20,  'easeOutCubic');
			animateAttribute( 'width', 10, 200,  rects[2],  2,  20,  'easeInElastic').then(() => {
				doRects();
			});
		}

		/*run animation*/
		animate();
		doRects();
	});

}());
