import requestIP from 'request-ip'
export const getClientIp = (req) => {
  return requestIP.getClientIp(req)
}