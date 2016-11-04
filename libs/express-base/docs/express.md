# Express.js

[Express.js](https://expressjs.com/) is our web-framework of choice and currently these additions are in place on top of express:

# View-promise-resolver
Replaced `res.render(viewName, viewData, callback)`.

Calling `res.render(viewName, {hello: 'world'})` will call our `res.finnRender` which
does a promise-resolving-pass on `res.locals` and the viewData before calling the "original" `res.render()`.

If you by some reason want to bypass our `res.render`, call `res.expressRender` instead.


Examples of usage:

```js

app.get('/1', (req, res) => res.render('index', {hello: 'world'}));

app.get('/2', (req, res) => res.render('index', {hello: Promise.resolve('world')}));

```


Using `res.locals` in other middlewares:

```js
const middleware = (req, res, next) => {
    res.locals.key1 = new Promise(resolve => {
        setTimeout(() => resolve(1), 100);
    });
    res.locals.key2 = new Promise(resolve => {
        setTimeout(() => resolve(2), 10);
    });
    res.locals.key3 = {
        key4: new Promise(resolve => {
            setTimeout(() => resolve(4), 10);
        });
    };
}
app.get('/3', middleware, (req, res) => {
    res.render('index', { hello: Promise.resolve('world') }) // => viewData resolves to {key1: 1, key2: 2, key3: { key4: 4 }, hello: 'world' }
});
```
