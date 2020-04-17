# Gateway Server

## generating cert keys for `HTTP/2`

```bash
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout scripts/keys/localhost-privkey.pem -out scripts/keys/localhost-cert.pem
```
