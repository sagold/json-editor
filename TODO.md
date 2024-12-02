- _allOf_ + _liveUpdate=true_ statement loses focus when error is added or removed (@see ObjectProperties page)
- errors are unexpectedly missing after udpates (from plugin?) -> in general: when to do validation
- update of errors should redraw component using useEditor hook
- json-code widget loses data for mixed content-types

todo

- test json schema editors
- fix support additionalProperties/Items in getArrayAddOptions/getChildSelection, return empty list if false
- maybe refocus replaced widget (e.g. input to textarea while typing)

code smells

- `schema.getOneOfOrigin`, cache value, not serialisable (but retrievable)
- `schema.sourceSchema`, heavy duplication but probably required. Alternative?
- `create` `isArrayItem` introduces error surface if omitted -> property as number

maybe

- [cannot reproduce] with _liveupdate=false_ multiselect delete is slow or misses update
