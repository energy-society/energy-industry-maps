# Ensure build/ exists
if [ ! -d build/ ]; then
  echo "No build/ folder!"
  exit 1
fi

# Checkout publish branch
git checkout gh-pages
git fetch origin gh-pages

# Remove known files on this branch
git rm $(git ls-tree -r --name-only HEAD)

# Make a backup copy of the build
rm -r .build-cache
cp -r build .build-cache

# Move new build here
git add build/*
git mv build/* .

# Commit and push
git commit -m "release"
git push origin gh-pages

# Clean up
git checkout master
rm -r build
mv .build-cache build
