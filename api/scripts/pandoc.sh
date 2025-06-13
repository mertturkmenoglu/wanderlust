#!/bin/env bash

# For each wikitext file, run pandoc to convert it to plain text.
for F in *.wikitext; do
    # Run pandoc
    docker run --rm \
      --volume "$(pwd):/data" \
      --user $(id -u):$(id -g) \
      pandoc/extra -f mediawiki -t plain -o "$F.txt" "$F"

    # Remove footnotes
    sed -E -i 's/\[[0-9]+\]//g' "$F.txt"
    
    # Convert \n\n chars to actual newlines
    sed $'s/\\\\n\\\\n/\\\n\\\n/g' "$F.txt" > "$F-a.txt"
    
    # Take until ==..== pattern
    awk '!/==.*==/ { print } /==.*==/ { exit }' "$F-a.txt" > "$F-b.txt"

    # Remove interim files
    rm "$F.txt" "$F-a.txt" "$F-b.txt"
    # Rename last file to original name
    mv "$F-c.txt" "$F.txt"
done
