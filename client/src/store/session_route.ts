import { NavigationType } from '@/types/NavigationType';

const SESSION_ROUTE_KEY_PREFIX = 'object-cloud-session-route';

export type SessionSection = 'drive' | 'resourcePool' | 'streamingVideo';

export type ResourcePoolStackItem = {
  name: string;
  path?: string;
};

type SessionRouteState = {
  lastRoute?: string;
  sectionRoutes?: Partial<Record<SessionSection, string>>;
  driveNavigation?: NavigationType[];
  resourcePoolStack?: ResourcePoolStackItem[];
};

const getSessionRouteKey = (userUuid: string) => `${SESSION_ROUTE_KEY_PREFIX}:${userUuid}`;

const emptyState: SessionRouteState = {
  sectionRoutes: {},
  driveNavigation: [],
  resourcePoolStack: [],
};

const readState = (userUuid: string): SessionRouteState => {
  if (!userUuid) {
    return emptyState;
  }

  const raw = sessionStorage.getItem(getSessionRouteKey(userUuid));
  if (!raw) {
    return emptyState;
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      ...emptyState,
      ...parsed,
      sectionRoutes: parsed.sectionRoutes || {},
      driveNavigation: Array.isArray(parsed.driveNavigation) ? parsed.driveNavigation : [],
      resourcePoolStack: Array.isArray(parsed.resourcePoolStack) ? parsed.resourcePoolStack : [],
    };
  } catch {
    return emptyState;
  }
};

const writeState = (userUuid: string, nextState: SessionRouteState) => {
  if (!userUuid) {
    return;
  }
  sessionStorage.setItem(getSessionRouteKey(userUuid), JSON.stringify(nextState));
};

const getSectionFromPath = (pathname: string): SessionSection | null => {
  if (pathname === '/home/drive' || pathname.startsWith('/home/drive/')) {
    return 'drive';
  }
  if (pathname === '/home/driveResourcePool') {
    return 'resourcePool';
  }
  if (pathname === '/home/streamingVideo') {
    return 'streamingVideo';
  }
  return null;
};

export const rememberSessionRoute = (userUuid: string, pathname: string) => {
  const section = getSectionFromPath(pathname);
  if (!section) {
    return;
  }

  const state = readState(userUuid);
  writeState(userUuid, {
    ...state,
    lastRoute: pathname,
    sectionRoutes: {
      ...state.sectionRoutes,
      [section]: pathname,
    },
  });
};

export const getLastSessionRoute = (userUuid: string) => readState(userUuid).lastRoute || '/home/drive';

export const getSectionSessionRoute = (userUuid: string, section: SessionSection) => {
  const state = readState(userUuid);
  return state.sectionRoutes?.[section] || {
    drive: '/home/drive',
    resourcePool: '/home/driveResourcePool',
    streamingVideo: '/home/streamingVideo',
  }[section];
};

export const saveDriveSessionNavigation = (userUuid: string, navigation: NavigationType[]) => {
  const state = readState(userUuid);
  writeState(userUuid, {
    ...state,
    driveNavigation: navigation,
  });
};

export const getDriveSessionNavigation = (userUuid: string) => readState(userUuid).driveNavigation || [];

export const saveResourcePoolSessionStack = (userUuid: string, stack: ResourcePoolStackItem[]) => {
  const state = readState(userUuid);
  writeState(userUuid, {
    ...state,
    resourcePoolStack: stack,
  });
};

export const getResourcePoolSessionStack = (userUuid: string) => readState(userUuid).resourcePoolStack || [];

export const clearSessionRoute = (userUuid: string) => {
  if (!userUuid) {
    return;
  }
  sessionStorage.removeItem(getSessionRouteKey(userUuid));
};
