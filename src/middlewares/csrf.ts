import * as hostValidation from 'host-validation'

// NOTE(@mxstbr):
// - Host header only contains the domain, so something like 'build-api-asdf123.now.sh' or 'oojob.io'
// - Referer header contains the entire URL, so something like
// 'https://build-api-asdf123.now.sh/forward' or 'https://oojob.io/forward'
// That means we have to check the Host slightly differently from the Referer to avoid things
// like 'my-domain-oojob.io' to be able to hack our users

// Hosts, without http(s):// and paths
const { NOW_URL = 'http://oojob.io' } = process.env
const trustedHosts = [
	NOW_URL && new RegExp(`^${NOW_URL.replace('https://', '')}$`),
	/^oojob\.io$/, // The Domain
	/^.*\.oojob\.io$/ // All subdomains
].filter(Boolean)

// Referers, with http(s):// and paths
const trustedReferers = [
	NOW_URL && new RegExp(`^${NOW_URL}($|\/.*)`),
	/^https:\/\/oojob\.io($|\/.*)/, // The Domain
	/^https:\/\/.*\.spectrum\.chat($|\/.*)/ // All subdomains
].filter(Boolean)

const csrf = hostValidation({
	hosts: trustedHosts,
	referers: trustedReferers,
	mode: 'either'
})
export default csrf
