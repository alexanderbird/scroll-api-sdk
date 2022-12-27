#!/bin/bash
set -xe

api="$(aws ssm get-parameter --name apiId | jq -r '.Parameter.Value')"
apiKeyId="$(aws ssm get-parameter --name publicAccessApiKey | jq -r .Parameter.Value)"
token="$(aws apigateway get-api-key --api-key "$apiKeyId" --include-value | jq -r .value)"
endpoint="https://$api.execute-api.ca-central-1.amazonaws.com/prod"

curl -H "x-api-key: $token" "$endpoint/Feed?language=en&translation=web-mini&feedStart=$(date | md5)"
