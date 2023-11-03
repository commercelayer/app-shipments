// eslint-disable-next-line prettier/prettier
export { }

declare global {
  interface Window {
    clAppConfig: {
      domain: string
      gtmId?: string
    }
  }
}
