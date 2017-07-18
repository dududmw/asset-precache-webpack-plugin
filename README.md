# Asset Precache Webpack Plugin

## Installation

npm:
```
npm install asset-precache-webpack-plugin --save-dev
```

## Useage

* webpack config
```
var AssetPrecachePlugin=require('asset-precache-webpack-plugin');
var webpackConfig={
    ...
    plugins:[new AssetPrecachePlugin({
        key:'__precacher',
        filename:'precache.[chunkhash:8].js',
    })]
    ...
}
```
* runtime code
```
window.__precacher
    .filter({key:'type',reg:/^(image|js)$/})
    .load()
```

## Configuration

* filename: Relative path to webpack output path. Support hash, chunkhash. e.g. precache.[chunkhash:8].js
* key: entry of precache module in window. e.g. '__precacher', use window.precacher runtime.

## Run

* Get root obj by key which is specified in webpack config
```
var precacher=window.__precacher;
```
* Use filter method to decide which asset not cache. Filter has one parameter with two kind of format: obj or function.
```
var resource=precacher.filter({key:'type',reg:/^(image|js)$/})
```
* Use load method to precache assets
```
resource.load()
```

