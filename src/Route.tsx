import React, { useContext } from 'react';
import { RouterContext } from './RouterContext';

export type RouteParams = { [s: string]: string };

export interface RouteComponentProps {
    params: RouteParams;
}

export interface RouteProps {
    children?: ((params: RouteParams) => React.ReactNode) | React.ReactNode;
    path: string;
    component?: React.ComponentType<RouteComponentProps>;
}

export function Route(props: RouteProps) {
    const router = useContext(RouterContext);
    const params = router.matchRoute(props.path, router.path);

    if (!params)
        return null;

    const Component = props.component;
    if (Component)
        return <Component params={params} />;

    return typeof props.children === "function" ? props.children(params) : props.children;
}
