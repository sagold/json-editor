possible bugs

- _allOf_ + _liveUpdate=true_ statement loses focus when error is added or removed (@see ObjectProperties page)
- errors are unexpectedly missing after udpates (from plugin?) -> in general: when to do validation
- update of errors should redraw component using useEditor hook
- json-code widget loses data for mixed content-types
- `create` `isArrayItem` introduces error surface if omitted -> property as number
- maybe refocus replaced widget (e.g. input to textarea while typing)
- [cannot reproduce] with _liveupdate=false_ multiselect delete is slow or misses update
