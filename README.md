# Lettering SVG-Texts / Tspans and numberic SVG-Attributes

## Description
Demonstrate a lettering / typewriter animation with SVG text elements (and their tspan children).
Also included a functions which allows to animate numeric SVG-attributes like line-width, opacity, width etc.
Included the bezier-easings from https://github.com/gre/bezier-easing for SVG-Attributes.
The little library makes use of promises so that the animations can be chained together.

I made this because other animations lib (like greensocks) have too much overhead for simple animations.


## Getting Started
To build it I used rollup (https://github.com/rollup/rollup) with one simple plugin `rollup-plugin-generate-html-template`. 
So you might run 

```yarn add rollup rollup-plugin-generate-html-template```

when you want to build this for older browser (no async), you need to run it through babel


## Authors

* **larslo**  (https://larslo.de)


## Credits

thanks for bezier-easings from https://github.com/gre/bezier-easing
rollup: https://github.com/rollup/rollup

## License

This project is licensed under the MIT License

