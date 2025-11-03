export const VERSION = {
  major: 3,
  minor: 4,
  patch: 1,
  full: '3.4.1',
  buildDate: new Date('2025-11-03').toISOString(),
  environment: process.env.NODE_ENV || 'production'
};

export function getVersionString(): string {
  return `v${VERSION.full}`;
}

export function getFullVersionInfo() {
  return {
    version: VERSION.full,
    buildDate: VERSION.buildDate,
    environment: VERSION.environment
  };
}
