for file in *; do
  if [[ "$file" == *"_副本"* ]]; then
    new_file="${file//_副本/}"
    mv "$file" "$new_file"
  fi
done