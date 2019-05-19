import React, { isValidElement, useContext } from 'react';
import { RouteProps } from './Route';
import { RouterContext } from './RouterContext';

export interface SwitchProps {
    children: React.ReactElement<RouteProps>[];
}

export function Switch(props: SwitchProps) {
    const { matchRoute, path } = useContext(RouterContext);

    return props.children.find((child) => child && isValidElement(child) && !!matchRoute(child.props.path, path)) || null;
}
