LAMBDA_URL=$1

curl -v "$LAMBDA_URL" -d '{"name":"Nichollas"}' -H "Content-Type: application/json" -X POST