# 1.0.0

**Breaking Changes**

- renamed `Node` to `DataNode` to avoid collisions with native Node type
- prefer `x-options` over `options` schema keyword and change format-ids to `x-widget`
- set draft-2020-12 as default draft

**Features**

- add drag and drop support between arrays
- add drop validation for draggable items
- introduce selection feature with SelectionProvider
- add basic selection integration
- add all widgets and types to package export
- extend useDraggableItems api
- add optional oneOfIndex to value nodes
- add support for liveUpdate option (string, color, number & multi-select widgets)
- add StringWidget clear action

**Bug Fixes**

- fix lint issues
- fix broken storybook tests
- fix stale pointer in widget-field
- fix safari drag error message
- fix selectable example
- fix error logs using BooleanWidget
- fix broken multiSelect widget
- fix datetime picker
- fix missing mantine styles
- fix code jsonWidget completions and linting
- fix removeNode with dependencies schema
- fix broken support of type: integer
- fix useLiveUpdate working with arrays

**Updates**

- replace yarn with pnpm for package management
- upgrade to React 19
- upgrade to Mantine 8
- upgrade to Storybook/Vite
- upgrade ESLint
- upgrade CodeMirror and testing-library dependencies
- update json-schema-library
- update package exports
- dragndrop to destroy sortable instances
- array item styles
- do not render child-wrapper when node is hidden

**Documentation**

- add example for layout editor
- add simple example for drag and drop template to create array item
- update drag & drop list examples
- update array and object overview
- add boolean widget stories
- add draft-tabs for array-items and object-properties
- update functional api documentation
- update code-widget overview

**Internal Changes**

- refactor: group selection and dragndrop by feature
- refactor: replace deepEqual schema checks by dynamicId
- refactor: use widget-header for oneof-select-widget
- test: add component tests and story tests
- test: DateTimeWidget
- ci: refactor pipeline and add story test report

# 0.37.0

- draft support from draft-04 to draft-2020-12
- cross-draft support

**breaking changes**

- `draftConfig` has been replaced by list of `drafts`

_headless-json-editor_

- functional api has changed and draft is no longer required

_react-json-editor_

- use node.prefixItems instead of schema.items to be consistent across drafts
