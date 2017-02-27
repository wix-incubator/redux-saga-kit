require('babel-register')({
    ignore: function(filename) {
        if (filename.indexOf('node_modules') !== -1)
            return true;
        return false;
    },
    'presets': ['es2015', 'stage-2'],
    'plugins': ['transform-runtime']
});
