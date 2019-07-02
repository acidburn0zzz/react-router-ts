import React, { useCallback } from 'react';
import { useRouter } from './hooks';

export function useRouteLink(href: string, onClick?: React.EventHandler<React.MouseEvent<HTMLElement>>) {
    const { history, basename } = useRouter();

    const onClickWrapped = useCallback((e: React.MouseEvent<HTMLElement>) => {
        try {
            onClick && onClick(e);
        } catch (e) {
            console.error(e);
        }
        if (!e.defaultPrevented) {
            e.preventDefault();
            history.push(href);
        }
    }, [href, onClick, history]);

    return {
        onClick: onClickWrapped,
        href: `${basename}${href}`
    }
}

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
}

export function Link(props: React.PropsWithChildren<LinkProps>) {
    const routeLink = useRouteLink(props.href, props.onClick);
    return <a {...props} href={routeLink.href} onClick={routeLink.onClick} />;
}
