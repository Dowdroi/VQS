import { AppRoutes } from '@/constants/AppRoute';
import { useMemo } from 'react';
import { useNavigate, NavigateOptions } from 'react-router-dom';

type AppRoutesType = typeof AppRoutes;
type Leaves<T> = T extends object
  ? {
      [K in keyof T]: `${K & string}${Leaves<T[K]> extends never
        ? ''
        : `.${Leaves<T[K]>}`}`;
    }[keyof T]
  : never;
type AppRoutePaths = Leaves<AppRoutesType>;

type ExtractParams<T extends string> =
  T extends `${infer _}:${infer Param}/${infer Rest}`
    ? Param | ExtractParams<Rest>
    : T extends `${infer _}:${infer Param}`
      ? Param
      : never;

export const useAppNavigation = () => {
  const navigate = useNavigate();

  const appNavigate = useMemo(() => {
    const navigateTo = <T extends AppRoutePaths>(
      route: T,
      params?: Record<ExtractParams<T>, string>,
      options?: NavigateOptions
    ) => {
      const paths = route.split('.');
      let currentPath: any = AppRoutes;
      for (const path of paths) {
        currentPath = currentPath[path];
      }

      let finalPath = currentPath as string;
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          finalPath = finalPath.replace(`:${key}`, value as string);
        });
      }

      navigate(finalPath, options);
    };

    return {
      navigateTo: navigateTo,
      navigateBack: () => navigate(-1),
      navigateReplace: <T extends AppRoutePaths>(
        route: T,
        params?: Record<ExtractParams<T>, string>
      ) => navigateTo(route, params, { replace: true }),
    };
  }, [navigate]);

  return appNavigate;
};
