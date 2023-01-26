- _allOf_ + _liveUpdate=true_ statement loses focus when error is added or removed (@see ObjectProperties page)

todo

- test json schema editors


code smells

- `schema.getOneOfOrigin`, cache value, not serialisable (but retrievable)
- `schema.sourceSchema`, heavy duplication but probably required. Alternative?
- `create` `isArrayItem` introduces error surface if omitted -> property as number


maybe 

- [cannot reproduce] with _liveupdate=false_ multiselect delete is slow or misses update
