## start with glass styles of all variations

- add missing `box-shadow: none` for flat glasses
- backdrop-filter has a high impact on rendering performance. We should consider removing this for most cases (forms)
- deviated from desgin by adding an active border to select button (on focus, hover and active)
- for input-glass-light, shaded borders are not possible, figma styles do not result in shaded border. Additionally checkbox is inconsistent to toher glass styles (not taken from input) - which one is correct?

## components

### select

- select is not optimal as the button size does not grow with to the largest value (would be nicer)
- select requires popover within `.rje-select-field` to inherit the theme-class


## definitions


### field

A `field` component consists of a input-field ad optionally label, description or error texts. A `field` can be

- `required`
- `disabled`
- `invalid`
