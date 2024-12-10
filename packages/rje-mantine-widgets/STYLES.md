# form field

```
label
description
input
errors
```

```
.rje-field .mantine-InputWrapper-root

  [label] label.mantine-InputWrapper-label
  [description] p.mantine-InputWrapper-description
  [input] div.mantine-Input-wrapper
    > margin-top: var(--input-margin-top, 0rem);
    > margin-bottom: var(--input-margin-bottom, 0rem); [custom]
  [error] p.mantine-InputWrapper-error
```

```
object
  properties
    property
    property
    property
```

```
.rje-field.rje-field--object .mantine-InputWrapper-root
  [label] label.mantine-InputWrapper-label
  [properties] div[collapse-container] .rje-object__properties.mantine-Stack-root
    [property] .rje-object__property.mantine-Flex-root
    [property] .rje-object__property.mantine-Flex-root
    [property] .rje-object__property.mantine-Flex-root
```

```
array
  items
    item
    item
    item
```

```
.rje-field.rje-field--array .mantine-InputWrapper-root
  [label] label.mantine-InputWrapper-label
  [items] div[collapse-container] table.rje-array__items
    > --table-vertical-spacing: calc(0.4375rem* var(--mantine-scale));
    [item] td.mantine-Table-td
      > padding: var(--table-vertical-spacing) var(--table-horizontal-spacing, var(--mantine-spacing-xs));

    [item] td.mantine-Table-td
      > padding: var(--table-vertical-spacing) var(--table-horizontal-spacing, var(--mantine-spacing-xs));

    [item] td.mantine-Table-td
      > padding: var(--table-vertical-spacing) var(--table-horizontal-spacing, var(--mantine-spacing-xs));
```
