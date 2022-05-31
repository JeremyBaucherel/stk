<<<<<<< Updated upstream
The Symphonie Tool Kit (STK) is a set of React components used to build the ASGARD web interface based on Symphonie interface (1Y77).

![Symphonie screenshot]<img src="https://gheprivate.intra.corp/ASGARD/stk/blob/master/doc/images/symphonie-screenshot.png?raw=true">
=======
The Symphonie Tool Kit (STK) is a set of React components used to build the
[ASGARD](https://communities.intra.corp/sites/symphonie/default.aspx) web interface.

![ASGARD screenshot](https://gheprivate.intra.corp/raw/ASGARD/stk/master/doc/images/symphonie-screenshot.png)

See also: [ASGARD-ui](https://gheprivate.intra.corp/ASGARD/symphonie-ui)
>>>>>>> Stashed changes

## Use as library

Add the GIT repository to your dependencies inside your `package.json`.
```javascript
"dependencies": {
    "stk": "git://gheprivate.intra.corp/ASGARD/stk.git"
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
