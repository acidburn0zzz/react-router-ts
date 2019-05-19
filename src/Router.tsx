import React, { useReducer, useEffect } from 'react';
import { RouterContext, RouterContextValue } from './RouterContext';
import { createHistory } from './history';
import { createRouteMatcher, RouteMatcherFactory } from './routeMatcher';
import { getPathWithoutBasename } from './basename';

export interface RouterProps {
    basename?: string;
    routeMatcherFactory: RouteMatcherFactory;
}

const setPathReducer = (state: RouterContextValue, path: string) => ({ ...state, path });

export const Router = (props: React.PropsWithChildren<RouterProps>) => {
    const basename = props.basename || "";
    const [router, setPath] = useReducer(setPathReducer, null, () => ({
        basename,
        history: createHistory(basename, (path) => setPath(path)),
        path: getPathWithoutBasename(basename),
        matchRoute: createRouteMatcher(props.routeMatcherFactory)
    }));
    useEffect(() => router.history.stop, []);
    return <RouterContext.Provider value={router}>{props.children}</RouterContext.Provider>;
};
