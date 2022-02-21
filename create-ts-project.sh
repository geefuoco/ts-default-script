echo "Please enter the name of your project";
read NAME;
echo "Creating folder $NAME ..."
mkdir $NAME;
cd $NAME;
npm init -y;
npm i -D typescript typesync @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier jest;
echo "{ 
    \"compilerOptions\": { 
        \"rootDir\": \"src\", 
        \"outDir\": \"build\", 
        \"target\": \"es6\", 
        \"allowJs\": true, 
        \"moduleResolution\": \"node\", 
        \"module\": \"commonjs\", 
        \"esModuleInterop\": true, 
        \"forceConsistentCasingInFileNames\": true, 
        \"strict\": true, 
        \"skipLibCheck\": true 
    }, 
    \"include\": [\"src\"], 
    \"exclude\": [\"node_modules\", \"build\"] 
}" > tsconfig.json;
echo "{ 
    \"root\": true, 
    \"parser\": \"@typescript-eslint/parser\", 
    \"plugins\": [ 
        \"@typescript-eslint\" 
    ], 
    \"extends\": [ 
        \"eslint:recommended\", 
        \"plugin:@typescript-eslint/recommended\" 
    ] 
}" > .eslintrc;
echo "{ 
    \"semi\": true, 
    \"trailingComma\": \"none\", 
    \"singleQuote\": false, 
    \"printWidth\": 80, 
    \"useTabs\": false, 
    \"tabWidth\": 2, 
    \"bracketSpacing\": true, 
    \"bracketSameLine\": false 
}" > .prettierrc;
npx typesync;
npm i;
npm set-script test "jest --watch";
npm set-script format "prettier --config .prettierrc 'src/**/*.ts' --write";
npm set-script lint "eslint src --ext .ts --fix"; 
mkdir src;
touch ./src/index.ts;
echo "
node_modules
build
dist
.env
" > .gitignore;
git init;
cd ..;
echo "Successfully created folder $NAME with default configs";



