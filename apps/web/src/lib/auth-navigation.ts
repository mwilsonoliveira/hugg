/** Only known site pages can be used as authentication return destinations. */
export function safeReturnTo(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/") || /[\\\u0000-\u0020\u007f]/.test(value)) return "/";

  const pathname = value.split(/[?#]/, 1)[0];
  if (pathname !== "/" && !/^\/pets\/[a-zA-Z0-9_-]+(?:\/edit)?$/.test(pathname ?? "")) return "/";
  return value;
}

export function loginHref(returnTo: string): string {
  return `/login?next=${encodeURIComponent(safeReturnTo(returnTo))}`;
}
