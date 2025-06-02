op=$1

if [ $op = "env-example" ]; then
  echo "=> Creating example .env file..."
	infisical secrets generate-example-env > .env.example
	echo "=> Created example .env file"
elif [ $op = "env-pull" ]; then
  echo "=> Exporting secrets to .env file..."
	infisical export > .env
	echo "=> Exported secrets to .env file"
elif [ $op = "env-push" ]; then
  echo "=> Pushing secrets to Infisical..."
	infisical secrets set --file="./.env"
	echo "=> Pushed secrets to Infisical"
else
  echo "Invalid operation: $op"
  exit 1
fi
