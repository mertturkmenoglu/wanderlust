#!/bin/env bash

set -euo pipefail

# We are going to read the `.env` file.
FILE=".env"

# Remove lines starting with ##
sed -i '/^##/d' "$FILE"

# Remove "# Environment Variables" comment
sed -i '/^# Environment Variables/d' "$FILE"

# Remove # from the beginning of each line
sed -i 's/^#//' "$FILE"

# Remove empty lines
sed -i '/^[[:space:]]*$/d' "$FILE"
