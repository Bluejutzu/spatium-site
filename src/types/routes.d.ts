// This file is auto-generated. Do not edit manually.
type StaticPaths = '/' | '/' | '/playground' | '/pricing' | '/servers';

type DynamicPaths =
  | `/dashboard/${string}/commands/builder/CommandFlowBuilder`
  | `/dashboard/${string}/commands/builder`
  | `/dashboard/${string}/commands/builder/loading`
  | `/dashboard/${string}/commands/builder`
  | `/dashboard/${string}/commands/CommandsClient`
  | `/dashboard/${string}/commands`
  | `/dashboard/${string}/commands/loading`
  | `/dashboard/${string}/commands`
  | `/dashboard/${string}`
  | `/dashboard/${string}/moderation`
  | `/dashboard/${string}/moderation/${string}`
  | `/dashboard/${string}`
  | `/dashboard/${string}/premium`
  | `/dashboard/${string}/roles`
  | `/dashboard/${string}/settings`
  | `/dashboard/${string}/settings/SettingsClient`
  | `/dashboard/${string}/settings/WelcomeSettingsSection`;

type RoutePath = StaticPaths | DynamicPaths | `${StaticPaths}?${string}`;

declare module 'next/router' {
  interface UrlObject {
    pathname: RoutePath;
    query?: {
      [key: string]: string | number | boolean | readonly string[] | undefined;
    };
    hash?: string;
  }

  interface NextRouter
    extends Omit<
      import('next/dist/shared/lib/router/router').NextRouter,
      'push' | 'replace'
    > {
    push(
      url: RoutePath | UrlObject,
      as?: string | UrlObject,
      options?: TransitionOptions
    ): Promise<boolean>;
    replace(
      url: RoutePath | UrlObject,
      as?: string | UrlObject,
      options?: TransitionOptions
    ): Promise<boolean>;
  }

  export function useRouter(): NextRouter;
}

declare module 'next/navigation' {
  interface NavigationUrlObject {
    pathname: RoutePath;
    query?: {
      [key: string]: string | number | boolean | readonly string[] | undefined;
    };
    hash?: string;
  }

  interface NavigationRouter
    extends Omit<
      import('next/dist/shared/lib/app-router-context.shared-runtime').AppRouterInstance,
      'push' | 'replace'
    > {
    push(
      href: RoutePath | NavigationUrlObject,
      options?: { scroll?: boolean }
    ): void;
    replace(
      href: RoutePath | NavigationUrlObject,
      options?: { scroll?: boolean }
    ): void;
    query: { [key: string]: string | string[] | undefined };
  }

  export { NavigationRouter };
  export function useRouter(): NavigationRouter;
  export function usePathname(): RoutePath;
  export function useSearchParams(): URLSearchParams & {
    get(key: string): string | null;
    getAll(): { [key: string]: string | string[] };
  };

  export declare function useParams<T extends Params = Params>(): T;
}

declare module 'next/link' {
  export interface LinkProps
    extends Omit<import('next/dist/client/link').LinkProps, 'href'> {
    href:
      | RoutePath
      | {
          pathname: RoutePath;
          query?: {
            [key: string]:
              | string
              | number
              | boolean
              | readonly string[]
              | undefined;
          };
          hash?: string;
        };
    children: React.ReactNode;
    className?: string;
  }

  export default function Link(props: LinkProps): JSX.Element;
}
