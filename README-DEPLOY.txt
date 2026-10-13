Dabbawise static site — deploy to GoDaddy (dabbawise.in)
1. cPanel > File Manager > public_html (or the domain's document root). Remove any default index/placeholder.
2. Upload the CONTENTS of this folder (including the hidden .htaccess) — or upload dabbawise-site.zip and Extract.
3. cPanel > SSL/TLS Status: make sure AutoSSL / a certificate covers dabbawise.in and www.dabbawise.in (HTTPS is required for the microphone and the offline service worker).
4. Visit https://dabbawise.in/ — hard refresh once. Updates: re-upload; bump the cache name in sw.js.
All paths are relative; no server code or database needed.
