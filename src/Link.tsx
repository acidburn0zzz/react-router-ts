import React, { useCallback } from "react";

import { useRouter } from "./hooks";

export function useRouteLink(href: string, onClick?: React.EventHandler<React.MouseEvent<HTMLElement>>) {
    const { history, basename } = useRouter();

    const onClickWrapped = useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            try {
                onClick?.(e);
            } catch (error) {
                console.error(error);
            }
            if (!e.defaultPrevented) {
                e.preventDefault();
                history.push(href);
            }
        },
        [href, onClick, history]
    );

    return {
        onClick: onClickWrapped,
        href: `${basename}${href}`,
    };
}

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
}

export function Link(props: React.PropsWithChildren<LinkProps>) {
    const routeLink = useRouteLink(props.href, props.onClick);
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return <a {...props} href={routeLink.href} onClick={routeLink.onClick} />;
}
