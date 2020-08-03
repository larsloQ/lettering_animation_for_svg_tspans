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
export function animateAttribute(attr, start, stop, svgElement, step, tick, easing = 'linear') {
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
