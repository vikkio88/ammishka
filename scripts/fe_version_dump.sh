APP_VERSION=`git rev-parse --short HEAD`
sed "s/REACT_APP_VERSION=.*/REACT_APP_VERSION=\"$APP_VERSION\"/" fe/.env.production > fe/.env.production.new
mv fe/.env.production.new fe/.env.production