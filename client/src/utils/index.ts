export const isDevelopment = process.env.NODE_ENV !== "production"

export function classMap(obj: { [key: string]: any }): string {
  return Object.keys(obj).filter(className => obj[className]).join(" ")
}

const base = isDevelopment ? "http://localhost:5000" : window.location
export function get(path: string, param?: { [key: string]: any }) {

  const queries = param ? `?${new URLSearchParams(param)}` : ""
  const url = `${base}/${path}${queries}`

  return fetch(url, {
    method: "GET",
    cache: "no-cache"
  })
}

export function post(path: string, param?: { [key: string]: any }) {

  const url = `${base}/${path}`
  const headers = new Headers()
  headers.append("Content-Type", "application/json")

  return fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(param)
  })
}

export function deletee(path: string) {

  const url = `${base}/${path}`

  return fetch(url, {
    method: "DELETE"
  })
}


export const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)