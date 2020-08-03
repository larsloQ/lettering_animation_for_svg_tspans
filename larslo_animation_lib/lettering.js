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
export function setDxToTspans(svgTextElement, xOffset) {
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
export function letterByLetterLineByLine(svgTextElement, tick) {
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
