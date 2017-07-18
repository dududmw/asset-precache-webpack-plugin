const fs=require('fs');
const path=require('path');
const ejs=require('ejs');
const md5 = require('blueimp-md5');

function getFileName(origin,hash,chunkhash){
    return origin.replace(/\[hash\:(\d+)\]/,function(a,b,c,d){
        var args=Array.from(arguments);
        if(args.length>0){
            return hash.substr(0,+b);
        }
        else{
            return null;
        }
    }).replace(/\[chunkhash\:(\d+)\]/,function(a,b,c,d){
        var args=Array.from(arguments);
        if(args.length>0){
            return chunkhash.substr(0,+b);
        }
        else{
            return null;
        }
    });
}
function AssetPrecacheWebpackPlugin(options) {
    this.options = Object.assign({
        filename: 'precache.[chunkhash:8].js',
        key: '__precacher'
    }, options);
}
AssetPrecacheWebpackPlugin.prototype.apply = function(compiler) {
    var classfyRules={
        js:/\.js$/,
        css:/\.css$/,
        image:/\.(png|jpg|jpeg|gif)$/,
        font:/\.(woff|woff2|svg|eot|ttf)$/
    };
    var assets={
        js:[],
        css:[],
        image:[],
        font:[]
    };
    var options=this.options;
    var fileName='';
    var flags={};
    compiler.plugin('after-compile', function(compilation, callback) {
        Object.keys(compilation.assets).forEach(function(assetKey){
            if(!flags[assetKey]){
                flags[assetKey]=1;
                Object.keys(classfyRules).forEach(function(ruleKey){
                    if(classfyRules[ruleKey].test(assetKey)){
                        assets[ruleKey].push({
                            loaded:false,
                            url:assetKey
                        });
                    }
                });
            }
        });
        callback();
    });
    compiler.plugin('compilation', function(compilation) {
        compilation.plugin('html-webpack-plugin-before-html-generation', function(htmlPluginData, callback) {
            htmlPluginData.assets.js.unshift(fileName);
            callback(null, htmlPluginData);
        });
    });
    compiler.plugin('emit', function(compilation, callback){
        var content=ejs.render(fs.readFileSync(path.join(__dirname,'template/precache.ejs'),{encoding:'utf8'}),{
            key:options.key,
            content:JSON.stringify(assets),
        });
        var chunkhash=md5(content);

        fileName=getFileName(options.filename,compilation.fullHash,chunkhash)
        compilation.assets[fileName] = {
            source: function() {
                return content;
            },
            size: function() {
                return content.length;
            }
        };
        callback();
    });
};

module.exports = AssetPrecacheWebpackPlugin;