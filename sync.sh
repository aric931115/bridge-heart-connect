#!/bin/zsh
git add .
git commit -m "auto sync: $(date +%Y-%m-%d %H:%M:%S)"
git push
