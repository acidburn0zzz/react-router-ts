import { useContext, useMemo } from 'react';
import { RouterContext } from './RouterContext';

export const useRouter = () => useContext(RouterContext);

export function useParams(path: string) {
    const router = useRouter();
    return useMemo(() => router.matchRoute(path, router.path), [path, router.path]);
}
