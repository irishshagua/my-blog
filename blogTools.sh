#!/bin/sh

HUGO_IMG="klakegg/hugo:latest"

# Fail Fast
set -e

run_locally() {
  printf "\033[0;32mStarting Hugo server locally\033[0m\n"
  docker run --rm -it -v $(pwd):/src -p 1313:1313 $HUGO_IMG server
}

build_and_deploy() {
  printf "\033[0;32mGenerating static site\033[0m\n"
  # Build the project.
  docker run --rm -it -v $(pwd):/src $HUGO_IMG
  
  printf "\033[0;32mDeploying updates to GitHub...\033[0m\n"

  # Go To Public folder
  cd public

  # Add changes to git.
  git add .

  # Commit changes.
  msg="rebuilding site $(date)"
  if [ -n "$*" ]; then
	msg="$*"
  fi
  git commit -m "$msg"

  # Push source and build repos.
  git push -f origin master
}


if [ -z "$1" ]; then
  echo "No argument supplied. Please use either 'debug' or 'deploy'"
  exit 1
fi

case $1 in
  debug)
    run_locally
    ;;
  deploy)
    build_and_deploy
    ;;
esac
