#!/bin/bash

export $(cat .env | xargs)

killall ngrok

openssl req -x509 -newkey rsa:4096 -sha256 -days 3650 -nodes \
  -keyout domain.key -out domain.crt -extensions san -config \
  <(echo "[req]"; 
    echo distinguished_name=req; 
    echo "[san]"; 
    echo subjectAltName=DNS:vishwarajanand.com,IP:127.0.0.1
    ) \
  -subj "/CN=vishwarajanand.com"

LOCAL_URL=https://ngrok-tunnel.vishwarajanand.com

customdomain=${LOCAL_URL/#https:\/\//}
subdomain=${customdomain/%.*}

# comment here if you want to use a custom subdomain
ngrok http -subdomain=$subdomain -region=$region 5000

# uncomment here if you want to use a custom domain, note you need to install TLS certificate, else FB will reject the URL
# ngrok http -region=us -hostname="$customdomain" 5000
# ngrok http -region=us -hostname="$customdomain" -key domain.key -crt domain.crt 5000
