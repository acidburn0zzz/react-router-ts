import { getPathWithoutBasename } from "./basename";

export interface RouterHistory {
    push: (path: string) => void;
    replace: (path: string) => void;
    stop: () => void;
}

export function createHistory(basename: string, onChange: (s: string) => void): RouterHistory {
    const onPopState = () => onChange(getPathWithoutBasename(basename));
    window.addEventListener("popstate", onPopState);
    return {
        push(path: string) {
            history.pushState({}, "", `${basename}${path}`);
            onChange(path);
        },
        replace(path: string) {
            history.replaceState({}, "", `${basename}${path}`);
            onChange(path);
        },
        stop() {
            window.removeEventListener("popstate", onPopState);
        }
    };
}
