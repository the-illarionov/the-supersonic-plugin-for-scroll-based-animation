#!/usr/bin/env sh

set -e

cd site

echo > .nojekyll

git init
git checkout -B main
git add -A
git commit -m 'deploy'

git push -f git@github.com:the-illarionov/the-supersonic-plugin-for-scroll-based-animation.git main:gh-pages

cd -