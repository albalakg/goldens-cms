# CMS

## Start with the development branch
```
go to branch dev
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Lints and fixes files
```
npm run lint
```

### Steps for deploying new version to production

### 1. Compiles and minifies for production
```
npm run build
```

### 2. Deploy the build to production
```
npm run deploy
```

### 3. Refreshes the CDN cache in his distributions
### before running the command, must enter the "invalidation.json" file and increment the number at the end of the string in the "CallerReference" field
### it is a unique id the notifies Cloudfront that a new invalidation needs to be created
```
npm run refresh
```