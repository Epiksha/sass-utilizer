# Sass-Utilizer

## About
Sass Utilizer is a dynamic utility builder for Sass (SCSS) aimed at generating utilities with minimal configuration.

The utilities generated follow the [Tailwind](https://tailwindcss.com/ "Tailwind") CSS framework's naming conventions. An example of a breakpoint utility in Tailwind:

```scss
@media (max-width: 780px) {
    .md\:m {
        margin: 1rem !important;
    }
}
```

Please note: as of version 3.0.0, Utilizer is built with syntax friendly to [Dart Sass](https://github.com/sass/dart-sass "Dart Sass"), the primary language implementation for Sass since LibSass (and by extension, Node Sass) [became a deprecated package](https://github.com/sass/node-sass/issues/2952 "LibSass deprecation issue"), meaning this package is no longer compatible with Node Sass.

## Install

In the command line with NPM: 
```js
npm install sass-utilizer --save-dev
```

Import into your directory:
```scss
@use 'sass-utilizer' as *;
```

Depending on your setup, you may need to include the full path name: 
```scss
@use '../node_modules/sass-utilizer/utilizer' as *;
```

## Usage

At its core, Sass Utilizer is essentially a mixin that will consume basic utilities and generate utilities of exponential complexity as a result of how you've configured them.

Here's an example of setting up Utilizer with a basic margin utility:

```scss
@use 'sass-utilizer' as *;

$utilities: (
    m: (
        styles: (
            margin: 1rem
        ),
        directions: true,
        increments: true,
        negatives: true,
        breakpoints: true,
        pseudos: (hover, focus)
    )
);

$bpConfig: (
    breakpoints: (
        sm: 568px,
        md: 780px,
        lg: 1200px,
    ),
    paradigm: min-width
);

@include utilizer.render($utilities, $bpConfig);
```

To outline the above:

* Utilizer accepts two arguments, a map of your utilities and the configuration for your breakpoints
* The label of the utility specified in `$utilities`, in this case `m`, is what Utilizer will use for the class name later on
* Style rules go in the nested `styles` map
* All properties, excluding `styles`, relate to configuration for generating utilities
* The second argument will consume any breakpoints listed in your breakpoint config variable and specify which breakpoint utility to generate with what rules
* The paradigm property in your breakpoint config will specify whether or not you want your utilities to be mobile-first or desktop-first.

## Configuration

Using the margin example once again, the following will be output by default from Utilizer, even if all config properties are set to false:

```css
.m {
  margin: 1rem !important;
}

.m-0 {
  margin: 0 !important;
}
```

If you want to output additional utilities, the available configuration properties and their usage are as follows:

* directions
* breakpoints
* increments
* negatives
* pseudos
* dives

### Directions
With the `directions` property set to true, additional utilities for top, right, bottom and left will be created, in that order, with the following being the output:

```scss
.mt {
    margin-top: 1rem !important;
}

.mr {
    margin-right: 1rem !important;
}

.mb {
    margin-bottom: 1rem !important;
}

.ml {
    margin-left: 1rem !important;
}
```

### Increments
The `increments` property allows you to generate multiplier modifiers for the values provided within the utility object. For a positive increment, that class name will look something like `.mt-2.5` while a negative increment would produce something like `.-mt-3.25`, once again following Tailwind's naming conventions.

**Note: the maximum and minimum can only be single digit numbers.**

There are 3 different ways you can use the `increments` property:

#### 1: Map
```scss
increments: (
    min: -3.5,
    max: 4,
    factor: 0.5
)
```

By setting `increments` to a map with `min`, `max` and `factor` properties, you can generate multiplier utilities, starting from the minimum and ending at the maximum, in increments of whatever you set the factor to. For example, the above would produce (as well as others):

```scss
.-mb-3.5 {
    margin: -3.5rem !important;
}

.-m-1.5 {
    margin: -3rem !important;
}

.m-2.5 {
    margin: 3.5rem !important;
}

.m-3 {
    margin: 3.5rem !important;
}

.mb-4 {
    margin: 4rem !important;
}
```

#### 2: List
As opposed to setting a factor and a maximum value within a map, if you were to assign a list to the `increments` property e.g. `increments: 0.5, 1.5, 2`, then only those specific numbers would be multiplied with the original value. Example output:

```scss
.m-0.5 {
    margin: 0.5rem !important;
}

.m-1.5 {
    margin: 1.5rem !important;
}

.m-2 {
    margin: 2rem !important;
}
```

The above would of course be in addition to the base utilities.

#### 3: Boolean set to true
Finally, the third option you have is to provide a boolean, e.g. `increments: true`. This would apply the default behavior of generating utilities in increments of 0.5 from -6 through 6.

### Negatives
The `negatives` property needs to be set to a boolean. It is the only property that is set to true by default, which will output negative modifiers for your utilities e.g. `.mt` would have a negative counterpart, `.-mt` which would apply the styling `margin-top: -1rem`.

This property is particularly useful in avoiding the generation of unwanted negative classes by the `increments` variable, though the main use case is when `increments` is set to true and you only want it to generate modifiers from 0 through 6.

### Pseudos
The `pseudos` property is responsible for defining pseudo selectors. If you wanted to target the hover and focus pseudo selectors of the element, you can simply configure the utility with `pseudos: (hover, focus)`. The output would be as follows (small example):

```scss
.hover\:m:hover {
    margin: 1rem !important;
}

.visited\:m:focus {
    margin: 1rem !important;
}
```

*Note: escaping backslashes do not need to be included when adding class to markup.*

### Breakpoints
With breakpoints set to true, your utilities will have corresponding breakpoint utilities for different screen sizes, determined by whatever you set your breakpoints to be when Utilizer was included.

A small sample of the possible output could be as follows:

```scss
.md:mb-3 {
    @media (min-width: 768px) {
        margin-bottom: 3rem !important;
    }
}

.xxl:mr-1.5 {
    @media (min-width: 1700px) {
        margin-right: 1.5rem !important;
    }
}
```

### Dives
The final configuration property is `dives`. If set to true, modifier classes will be created to target children of the element that the utility is assigned to, 'diving' down one level. The suffix `-dive` is added onto the class name so that this output

```scss
.xxl:mt-2 {
    @media (max-width: 1700px) {
        margin-right: 2rem !important;
    }
}
```

would have a counterpart utility, output as the following:

```scss
.xxl:mt-2-dive > * {
    @media (max-width: 1700px) {
        margin-right: 2rem !important;
    }
}
```