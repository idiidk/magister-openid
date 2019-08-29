export function extractQueryParameter(url, parameter) {
  const parsedUrl = new URL(url);

  return parsedUrl.searchParams.get(parameter);
}

export function getTime() {
  return Math.round(new Date().getTime() / 1000);
}
