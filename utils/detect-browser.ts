export function detectBrowser(userAgent: string) {
  userAgent = userAgent.toLowerCase();

  if (
    userAgent.includes("chrome") &&
    !userAgent.includes("edg") &&
    !userAgent.includes("opr")
  ) {
    return "Google Chrome";
  } else if (userAgent.includes("firefox")) {
    return "Mozilla Firefox";
  } else if (userAgent.includes("safari") && !userAgent.includes("chrome")) {
    return "Apple Safari";
  } else if (userAgent.includes("edg")) {
    return "Microsoft Edge";
  } else if (userAgent.includes("opr") || userAgent.includes("opera")) {
    return "Opera";
  } else if (userAgent.includes("msie") || userAgent.includes("trident")) {
    return "Internet Explorer";
  } else {
    return "Unknown Browser";
  }
}
