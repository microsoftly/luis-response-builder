# Luis Response Builder [![CircleCI](https://circleci.com/gh/microsoftly/luis-entity-builder/tree/master.svg?style=shield)](https://circleci.com/gh/microsoftly/luis-entity-builder/tree/master)
Simple Luis.ai type references and Response builders

Note that this is still a work in progress and PRs are very welcome!
Currently, the only prebuilt entities that is well defined are DateTimeV2 and Money

## LuisResponseBuilder
follows a method chaining pattern, e.g.
```javascript
    new LuisResponseBuilder('I want to return my purchase')
        .addIntent('returns', 0.93)
        .addIntent('purchase', .3)
        .addIntent('none': .01)
        .build()
```
### ```constructor(query)```
### ```addIntent(intent, score)```
### ```addPrebuiltEntity(prebuiltEntity)```
### ```addCustomEntity(customEntity)```
### ```build()```
returns an full luis.ai response object