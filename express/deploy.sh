#!/bin/bash
cd "../";

echo "FETCH GIT"
git pull origin main

echo "WEB"
cd ./web
npm install
npm run build

echo "EXPRESS"
cd ../express
npm install

forever stopall
forever start forever.json