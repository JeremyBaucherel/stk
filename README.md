The Software Tool Kit (STK) is a set of React components used to build the SAGA web interface.

![Exemple screenshot]<img src="https://gheprivate.intra.corp/ASGARD/stk/blob/master/doc/images/symphonie-screenshot.png?raw=true">

## Use as library

Add the GIT repository to your dependencies inside your `package.json`.
```javascript
"dependencies": {
    "stk": "git://github.com/JeremyBaucherel/stk.git"
}
```

So you can use any of the components:
```typescript
import * as Stk from 'stk';

function MyButton (): React.ReactNode {
    return (
        <Stk.Tooltip text="Hovering my button!">
            <Stk.Button icon={Stk.EIcon.INFO}>My button!</Stk.Button>
        </Stk.Tooltip>
    );
}
```

## Dependencies
* React
* ReactDOM
* ReactRouter
* ReactRouterDOM

## Lancement NPM
* npm install
* npm update
* npm start
