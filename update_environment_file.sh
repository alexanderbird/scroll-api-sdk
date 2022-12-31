#!/bin/bash
set -e
set -x
stage=prod
region=ca-central-1
api="$(aws ssm get-parameter --name apiId | jq -r '.Parameter.Value')"
endpoint="https://$api.execute-api.$region.amazonaws.com/$stage"

apiKeyId="$(aws ssm get-parameter --name publicAccessApiKey | jq -r .Parameter.Value)"
token="$(aws apigateway get-api-key --api-key "$apiKeyId" --include-value | jq -r .value)"
set +x

cat << EOF > src/this-file-is-generated-by-running-npm-run-update-environment.ts

/* This file is generated by running 'npm run update-environment'.
 * It is .gitignored so we don't accidentally commit the environment data.
 */

export const api = {
  endpoint: "$endpoint",
  token: "$token",
}

EOF

echo
echo "🎉 Generated: "
echo "+---------- src/this-file-is-generated-by-running-npm-run-update-environment.ts ---------+"
cat src/this-file-is-generated-by-running-npm-run-update-environment.ts | sed "s/^/|  /"
echo "+----------------------------------------------------------------------------------------+"
