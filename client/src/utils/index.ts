export const isDevelopment = process.env.NODE_ENV !== "production"

export function classMap(obj: { [key: string]: any }): string {
  return Object.keys(obj).filter(className => obj[className]).join(" ")
}

export function get(path: string, param?: { [key: string]: any }) {

  const base = isDevelopment ? "http://localhost:5000" : window.location
  const queries = param ? `?${new URLSearchParams(param)}` : ""
  const url = `${base}/${path}${queries}`

  return fetch(url, {
    method: "GET",
    cache: "no-cache"
  })
}

export const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)