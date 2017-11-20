const webpack = require('webpack');
const path = require('path');

module.exports = {
	entry: {
		app: './index.js'
	},
	output: {
		filename: '[name].bundle.js',
		path: path.join(__dirname, '/dist'),
		publicPath: '/dist/',
	},
	module: {
		rules: [
			{
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            js: 'babel-loader?presets=env'
          }
        }
      },
      { test: /iview.src.*?js$/, loader: 'babel-loader' },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      { test: /\.(png|jpg|gif|svg|ttf|eot|woff)$/, loader: 'file-loader?name=[name].[hash].[ext]'},
      { test: /\.css$/, loader: 'style-loader!css-loader' },
		]
	},
	plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('develope')
    })
  ],
  devServer:{
    inline: true,
    port: 1002,
    // contentBase: './www',
    proxy: {
      '/api/*': {
        target: 'http://localhost:1001',
        secure: false
      }
    }
  }
};
