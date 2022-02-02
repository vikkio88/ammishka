cd be_build
git init
git add .
git commit -m 'deploy'
heroku git:remote -a ammishka-be
git push -f heroku master