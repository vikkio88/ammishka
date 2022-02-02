rm -rf be_build
mkdir be_build 
cp -R be/src be/package.json be/package-lock.json shared be_build/
cp be/.env.production be_build/.env
APP_VERSION=`git rev-parse --short HEAD`
echo >> be_build/.env
echo "APP_VERSION=$APP_VERSION" >> be_build/.env
sed 's/file:..\/shared/file:.\/shared/' be_build/package.json > be_build/package.json.new
mv be_build/package.json.new be_build/package.json