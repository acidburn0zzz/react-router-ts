# react-router-ts

[![License](https://img.shields.io/badge/License-zlib/libpng-blue.svg)](https://github.com/Lusito/typed-undo/blob/master/LICENSE)

A simple, lightweight react router using hooks, written in TypeScript.

This project only has one peer dependency: React 16.8.6 or higher.

**Beware:** This library is shipped as es2015 modules. To use them in browsers, you'll have to transpile them using webpack or similar, which you probably already do.

#### Yet another router, seriously?

Yep. I'm hooked on reacts new hooks feature and wanted to try it in a new library. I saw a couple of hooks based routers, but aside from the fact, that they didn't have (maintained) types for TypeScript, they had other shortcomings.

### Installation via NPM

```npm i react-router-ts```

### Examples

#### Route Matching
Since this library doesn't force a route matching algorithm on you, you'll have to supply a factory. Here is a simple example using the popular [path-to-regexp](https://www.npmjs.com/package/path-to-regexp) library:

```tsx
import pathToRegexp from "path-to-regexp";
import { RouteParams } from "react-router-ts";

function routeMatcherFactory(pattern: string) {
    const keys: pathToRegexp.Key[] = [];
    const regex = pathToRegexp(pattern, keys);

    return (path: string) => {
        const out = regex.exec(path);

        if (!out) return null;

        return keys.reduce((params, key, i) => {
            params[key.name] = out[i + 1];
            return params;
        }, {} as RouteParams);
    }
}
```

Using pathToRegexp allows to extract named parameters from a path like "/users/:name".
I.e. if the path is "/users/Zaphod", then the param with the key "name" would have the value "Zaphod".

If you don't need dynamic shit like that, you can implement the routeMatcherFactory as simple as this:


```tsx
function routeMatcherFactory(pattern: string) {
    return (path: string) => ((path === pattern) ? {} : null);
}
```

#### Router
You'll need to add a `Router` component in your app (just one). Any other components and hooks from this library need to be children of this `Router` (doesn't matter how deeply nested).

```tsx
import { Router } from "react-router-ts";
export const App = () => (
    <Router routeMatcherFactory={routeMatcherFactory}>
        ....
    </Router>
);
```


### Route

Showing a component if the location matches a certain path is done with a `Route` component. It takes a `path` prop and either a `component` prop or children.

```tsx
export const Component = () => (
    <div>
        <Route path="/news" component={News} />
        <Route path="/fakenews">Drumpf</Route>
    </div>
);
```

**Beware:** If multiple routes have a matching path, all will be shown. Use a `Switch` if that's not desired.

#### Adding parameters

Let's say you have this route:

```tsx
export const Component = () => (
    <Route path="/news/:id" component={News} />
);
```

You defined a parameter :id in your path. Now you want to access it in your `News` component:

```tsx
export const News = (props: RouteComponentProps<{ id: string }>) => (
    <div>News ID: {props.params.id}</div>
);
```

#### Rendering children

You can render children manually instead of using a Component class like this:
```tsx
export const Component = () => (
    <Route path="/foo">Bar</Route>;
);
```

#### Using a callback

You can even use a callback instead of children like this:
```tsx
export const Component = () => (
    <Route path="/foo">{(params: { id: string }) => <div>Bar {params.id}</div>}</Route>;
);
```

#### Fresh Rendering

Let's say you have this route:

```tsx
export const Component = () => <Route path="/news/:id" component={News} />;
```

Moving from `/news/1` to `/news/2` will only update the components properties. State will be preserved.
If you want to force the component to be created from scratch in this situation, you can do so by setting the property `addKey` (boolean).
This will add the `key` property to the component with a value of the current path.

### Switch
If you only want the first `Route` that has a matching path to be shown, you can use a `Switch`:

```tsx
export const Component = () => (
    <Switch>
        <Route path="/news" component={News} />
        <Route path="/fakenews" component={FakeNews} />
        <Route path="/:fallback*" component={Otherwise} />
    </Switch>
);
```

#### Using a basename
If your app is not located at the root directory of a server, but instead in a sub-directory, you'll want to specify that sub-directory. You can do that on the `Router` component.

Basename will be prefixed on `Link` components.

```tsx
import { Router } from "react-router-ts";
export const App = () => (
    <Router basename="/my-app" routeMatcherFactory={routeMatcherFactory}>
        ....
    </Router>
);
```

If you have a `<base>` tag in your HTML, this can be easily detected using the `getBasename()` helper. That way you don't have to hard-code it:

```tsx
import { Router, getBasename } from "react-router-ts";
export const App = () => (
    <Router basename={getBasename()} routeMatcherFactory={routeMatcherFactory}>
        ....
    </Router>
);
```

#### Link

The `Link` component can be used to change the url and still act as a normal `<a>` tag, so you can open the link in a new tab.

```tsx
export const Component = () => (<Link href="/hello">Test</Link>);
```
Any extra props you pass in will be forwarded to the `<a>` element. If you specify an onClick property and it calls preventDefault(), then the history change will not happen, as would be the case with any normal link.

#### LinkButton, etc.

If you want to create a LinkButton or similar, you can do that easily. This is the implementation of Link:

```tsx
export function Link(props: React.PropsWithChildren<LinkProps>) {
    const routeLink = useRouteLink(props.href, props.onClick);
    return <a {...props} href={routeLink.href} onClick={routeLink.onClick} />;
}
```

Creating a `LinkButton` is as simple as this:
```tsx
import { useRouteLink } from "react-router-ts";
...
export function LinkButton(props: React.PropsWithChildren<LinkButtonProps>) {
    const routeLink = useRouteLink(props.href, props.onClick);
    return <button {...props} onClick={routeLink.onClick} />;
}
```

#### RouterContext

`Router` internally adds a RouterContext to your application, which you can access using `useRouter()`:

```tsx
import { useRouter } from "react-router-ts";
...
export function Component() {
    // router is of type RouterContextValue (see below)
    const router = useRouter();
    ....
}
```

`RouterContextValue` is defined as:
```tsx
export interface RouterContextValue {
    basename: string;
    path: string;
    history: RouterHistory;
    matchRoute: CachedRouteMatcher;
}
// with:
export interface RouterHistory {
    push: (path: string) => void;
    replace: (path: string) => void;
    stop: () => void; // for internal use, do not call.
}
// and:
export type CachedRouteMatcher = (pattern: string, path: string) => (RouteParams | null);
```

### Report isssues

Something not working quite as expected? Do you need a feature that has not been implemented yet? Check the [issue tracker](https://github.com/Lusito/react-router-ts/issues) and add a new one if your problem is not already listed. Please try to provide a detailed description of your problem, including the steps to reproduce it.

### Contribute

Awesome! If you would like to contribute with a new feature or submit a bugfix, fork this repo and send a pull request. Please, make sure all the unit tests are passing before submitting and add new ones in case you introduced new features.

### License

react-router-ts has been released under the [zlib/libpng](https://github.com/Lusito/typed-undo/blob/master/LICENSE) license, meaning you
can use it free of charge, without strings attached in commercial and non-commercial projects. Credits are appreciated but not mandatory.
