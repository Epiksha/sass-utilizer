# Sass-Utilizer

## About
Sass-Utilizer is a dynamic utility builder for SASS (SCSS) aimed at generating utilities with little to no configuration.

## Config

To begin with, you will need a map assigned to a `$utilities` variable. This map will be looped through through to generate classes dynamically. Within the map you will need to create objects, where the key is the name of the class and the content is the styling.

Optionally, you can have another map saved to a variable with the name `$utilityConfig`. This map is responsible for providing various modifier utilities.

While looping through the `$utilities` variable, checks will be made to determine if there is a matching key for an object in the `$utilityConfig` map; if it does exist, the rules within will be applied to *all* properties within that specific utility object. 

An example of the two maps are as follows:

```scss
$utilities: (
    m: (
        margin: 1rem
    )
);

$utilityConfig: (
    m: (
        directions: true,
        breakpoints: true,
        increments: true,
        states: (hover, focus, visited, active),
        dives: true
    )
);
```

*Note: The config you set for your utility will be specific to the utility and will not apply to any other utilities within the `$utilityConfig` map.*

You can also define `$utilityBreakpoints`, which you can use to define your breakpoints. By default, this variable will be set to:

```scss
$utilityBreakpoints: (
    sm: 576px,
    md: 768px,
    lg: 1200px
);
```

This variable is looped through to generate your breakpoint modifiers so you can include as many breakpoints as you wish.

Additionally, if you wish to keep the default breakpoints while adding additional breakpoints to the list, you can define an `$extraBreakpoints` variable, which will be joined to the `$utilityBreakpoints` variable before the latter is looped through.

Finally, the breakpoint mixin's configuration is set to be mobile-first by default; however, if you define a `$utilityBreakpointParadigm` variable, setting it to `max-width`,  you can create desktop-first utilities e.g.

```scss
$utilityBreakpointParadigm: max-width;
```

**Example `_utilities.scss` file:**

```scss
$utilities: (
    m: (
        margin: 1rem
    )
);

$utilityConfig: (
    m: (
        directions: true,
        breakpoints: true,
        increments: true,
        negatives: false,
        states: (hover, focus, visited, active),
        dives: true
    )
);

$utilityBreakpointParadigm: max-width;

$utilityBreakpoints: (
    sm: 575px,
    md: 767px,
    lg: 1199px
);
```

The config properties you can add to objects within $utilityConfig are as follows:

* directions
* breakpoints
* increments
* negatives
* states
* dives

Further information regarding each of these properties can be found below.

If you are using a multi-level directory structure, you will need to import `sass-utilizer` after all other variable imports to ensure the required variables are set.

### Directions Property
With the `directions` property set to true in `$utilityConfig`, additional utilities for the direction top, right, bottom and left will be created, the following being the output:

```scss
.mt {
    margin-top: 1rem;
}

.mr {
    margin-right: 1rem;
}

.mb {
    margin-bottom: 1rem;
}

.ml {
    margin-left: 1rem;
}
```

### Increments
Increments enable you to generate multiplier modifiers for the values provided within the utility object. For a positive increment, that class name will look something like `.mt-2.5` while a negative increment would produce `.-mt-3.25`, for example.

Additionally, a removal class will be created e.g. `.mt-0` to remove unneeded styling (particularly useful in conjunction with breakpoints).

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

By setting `increments` to a map with `min`, `max` and `factor` properties, you can generate multipler utilities, starting from the minimum and ending at the maximum, in increments of whatever you set the factor to. For example, the above would produce (as well as others):

```scss
.-mb-3.5 {
    margin: -3.5rem;
}

.-m-3 {
    margin: -3rem;
}

.m-3.5 {
    margin: 3.5rem;
}

.mb-4 {
    margin: 4rem;
}
```

#### 2: List
As opposed to setting a factor and a maximum value within a map, if you were to assign a list to the `increments` property e.g. `increments: 0.5, 1.5, 2`, then only those specific numbers would be multipled with the original value. Example output:

```scss
.m-0.5 {
    margin: 0.5rem;
}

.m-1.5 {
    margin: 1.5rem;
}

.m-2 {
    margin: 2rem;
}
```

#### 3: Boolean set to true
Finally, the third option you have is to provide a boolean, e.g. `increments: true`. This would apply the default behavior of generating multiplication modifier classes in increments of 0.5 from -6 through 6.

### Negatives
The `negatives` property needs to be set to a boolean. It is the only property that is set to true by default, which will output negative modifiers for your utilities e.g. `.mt` would have a negative counterpart, `.-mt` which would apply the styling `margin-top: -1rem`.

This property is particularly useful in avoiding the generation of unwanted negative classes by the `increments` variable. Though the main use case is when `increments` is set to true and it generates modifiers from -6 through 6, the property can be defined for any of the above 3 increment types.

### States
The `states` property is responsible for defining pseudo selectors. If you wanted to target the hover and visited states of the element, you can simply write `states: (hover, visited)`. The output could be as follows:

```scss
.hover\:m:hover {
    margin: 1rem;
}

.hover\:m:visited {
    margin: 1rem;
}
```

*Note: Escaping backslashes do not need to be included when adding class to markup.*

### Breakpoints
With breakpoints set to true, your utilities will have breakpoint modifiers for different screen sizes, determined by whatever `$utilityBreakpoints` is defined as.

An example of adding additional breakpoints to `$utilityBreakpoints` would be as follows:

```scss
$extraBreakpoints: (
    xl: 1500px,
    xxl: 1700px
);
```

This would then produce:

```scss
$utilityBreakpoints: (
    sm: 576px,
    md: 768px,
    lg: 1200px
    xl: 1500px,
    xxl: 1700px
);
```

Sass-Utilizer then loops through these breakpoints to generate classes for the various screen sizes.

A small sample of the possible output could be as follows:

```scss
.md:mb-3 {
    @media (max-width: 767px) {
        margin-bottom: 3rem;
    }
}

.xxl:mr-1.5 {
    @media (max-width: 1700px) {
        margin-right: 1.5rem;
    }
}
```

### Dives
The final configuration property is `dives`. If set to true, modifier classes will be created to target children of the element that the utility is assigned to, 'diving' down one level. The suffix `-dive` is added onto the class name so that this output

```scss
.xxl:mt-2 {
    @media (max-width: 1700px) {
        margin-right: 2rem;
    }
}
```

would have a counterpart utility, output as the following:

```scss
.xxl:mt-2-dive > * {
    @media (max-width: 1700px) {
        margin-right: 2rem;
    }
}
```

## Examples

### No Additional Modifiers
```scss
$utilities: (
    m: (
        margin: 1rem
    )
);

$utilityConfig: (
    m: (
        directions: false,
        increments: false,
        negatives: false,
        states: false,
        breakpoints: false,
        dives: false
    )
);

// Output
.m {
    margin: 1rem;
}

.m-0 {
    margin: 0;
}
```

### Directional Modifiers
```scss
$utilities: (
    m: (
        margin: 1rem
    )
);

$utilityConfig: (
    m: (
        directions: true,
        increments: false,
        negatives: false,
        states: false,
        breakpoints: false,
        dives: false
    )
);

// Output (including the above)
.mt {
    margin-top: 1rem;
}

.mr {
    margin-right: 1rem;
}

.mb {
    margin-bottom: 1rem;
}

.ml {
    margin-left: 1rem;
}
```

### Incremental Modifiers
```scss
$utilities: (
    m: (
        margin: 1rem
    )
);

$utilityConfig: (
    m: (
        directions: true,
        increments: true,
        negatives: false,
        states: false,
        breakpoints: false,
        dives: false
    )
);

// Output (small example, including the above output)
.m-1.5 {
    margin: 1.5rem;
}

.ml-2.5 {
    margin-left: 2.5rem;
}
```

### Negative Modifiers
```scss
$utilities: (
    m: (
        margin: 1rem
    )
);

$utilityConfig: (
    m: (
        directions: true,
        increments: true,
        negatives: true,
        states: false,
        breakpoints: false,
        dives: false
    )
);

// Output (small example, including the above output)
.-m-1.5 {
    margin: -1.5rem;
}

.-ml-2.5 {
    margin-left: -2.5rem;
}
```

### State Modifiers
```scss
$utilities: (
    m: (
        margin: 1rem
    )
);

$utilityConfig: (
    m: (
        directions: true,
        increments: true,
        negatives: true,
        states: (hover),
        breakpoints: false,
        dives: false
    )
);

// Output (small example, including the above output)
.-m-1.5:hover {
    margin: -1.5rem;
}

.-ml-2.5:hover {
    margin-left: -2.5rem;
}
```

### Breakpoint Modifiers
```scss
$utilities: (
    m: (
        margin: 1rem
    )
);

$utilityConfig: (
    m: (
        directions: true,
        increments: true,
        negatives: true,
        states: (hover),
        breakpoints: true,
        dives: false
    )
);

// Output (small example, including the above output)
.md\:-m-1.5:hover {
    margin: -1.5rem;
}

.lg\:-ml-2.5:hover {
    margin-left: -2.5rem;
}
```

### Dive Modifiers
```scss
$utilities: (
    m: (
        margin: 1rem
    )
);

$utilityConfig: (
    m: (
        directions: true,
        increments: true,
        negatives: true,
        states: (hover),
        breakpoints: true,
        dives: true
    )
);

// Output (small example, including the above output)
.md\:-m-1.5-dive > *:hover {
    margin: -1.5rem;
}

.lg\:-ml-2.5-dive > *:hover {
    margin-left: -2.5rem;
}
```