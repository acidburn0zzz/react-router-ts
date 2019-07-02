import React, { useMemo } from 'react';
import { useRouter } from './hooks';

export type RouteParams = { [s: string]: string };

export interface RouteComponentProps<T=RouteParams> {
    params: T;
}

export interface RouteProps {
    children?: ((params: RouteParams) => React.ReactNode) | React.ReactNode;
    path: string;
    component?: React.ComponentType<RouteComponentProps>;
    addKey?: boolean;
}

export function Route(props: RouteProps) {
    const router = useRouter();
    const params = useMemo(() => router.matchRoute(props.path, router.path), [props.path, router.path]);

    if (!params)
        return null;

    const Component = props.component;
    if (Component)
        return <Component params={params} key={props.addKey ? router.path : undefined} />;

    return typeof props.children === "function" ? props.children(params) : props.children;
}
