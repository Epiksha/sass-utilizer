# Sass-Utilizer

## About
Sass-Utilizer is a desktop-first utility library built for SASS (SCSS) to help dynamically generate utilities with minimal configuration.

## How it works

To begin with, you will need a SCSS map assigned to a `$utilities` variable. This will house all of your required utilities and Sass-Utilizer will loop through them to generate classes dynamically. For each SCSS object, the styling within will be used to generate the class.

Optionally, you can have another map saved to a variable with the name `$utilityConfig`. While looping through the `$utilities` variable, checks will be made to determine if there is a matching key for a SCSS object in the `$utilityConfig` map to provide additional classes for more specific styling.

An example of the two variables are as follows:

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
        increments: (
            factor: 0.5,
            max: 6
        ),
        divers: true
    )
);
```

Without the $utilityConfig, the above code would output:

```scss
.m {
    margin: 1rem;
}
```

The configurable properties that will be interpreted by Sass-Utilizer are as follows:

* Directions
* Breakpoints
* Increments
* Divers

### Directions Property
With the `directions` property set to true in `$utilityConfig`, the following code would be output in addition to the above:

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
Increments enable you to multiple the values provided within the utility object.

There are 3 different ways you can use the `increments` property:

#### 1: Map
```scss
increments: (
    factor: 0.5,
    max: 10
)
```

By creating a map with the `factor` and `max` properties, you can generate classes from the factor's original value to the maximum value provided, in increments of the factor. For example, the above could generate the following code as well as all other values in between (in increments of 0.5):

```scss
.m-0.5 {
    margin: 1rem * 0.5;
}

.mb-2 {
    margin: 1rem * 2;
}

.m-3.5 {
    margin: 1rem * 6.5;
}

.mb-6 {
    margin: 1rem * 10;
}
```

### 2: List
As opposed to setting a factor and a maximum value within a map, if you were to assign a list to the `increments` property e.g. `increments: 0.5, 1.5, 2`, then only those specific numbers would be multipled with the original value. Example output:

```scss
.m-0.5 {
    margin: 1rem * 0.5;
}

.m-1.5 {
    margin: 1rem * 1.5;
}

.m-2 {
    margin: 1rem * 2;
}
```

### 3: Anything Else (preferably a boolean set to true for clarity)
Finally, the third option you have is to provide a boolean, e.g. `increments: true`. This would apply the default behavior of generating multiplication modifier classes in increments of 0.5 from 0 through 6.

### Breakpoints
With breakpoints set to true, all of the classes above could have counterparts for various screen sizes. By default, the following three breakpoints are defined:

**sm**: 575px,
**md**: 767px,
**lg**: 1199px

These breakpoints are saved to the `$breakpoints` variable, which can be overwritten for custom breakpoints. Alternatively, by creating a list variable called `$extraBreakpoints`, you can add additional breakpoints to the already-existing default breakpoints e.g.

```scss
$breakpoints: (
    xl: 1300px,
    xxl: 1700px
);
```

would be combined with the original list to generate:

```scss
$breakpoints: (
    sm: 575px,
    md: 767px,
    lg: 1199px
    xl: 1300px,
    xxl: 1700px
);
```

Sass-Utilizer would then loop through all of the breakpoints, including the new additions, to generate classes for the various screen sizes.

A small sample of the possible output could be as follows:

```scss
.md:mb-3 {
    @media (max-width: 767px) {
        margin-bottom: 1rem * 3;
    }
}

.xxl:mr-1.5 {
    @media (max-width: 1700px) {
        margin-right: 1rem * 1.5;
    }
}
```

### Divers
The final configuration property is `divers`. If set to true, modifier classes would be created to target children of the element that the utility is assigned to, 'diving' down one level. The suffix `--dive` is added onto the class name so that

```scss
.xxl:mt-2 {
    @media (max-width: 1700px) {
        margin-right: 1rem * 2;
    }
}
```

would have a counterpart utility, output as the following:

```scss
.xxl:mt-2--dive > * {
    @media (max-width: 1700px) {
        margin-right: 1rem * 2;
    }
}
```