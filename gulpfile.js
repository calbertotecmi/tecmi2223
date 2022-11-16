'use strict';

const gulp = require('gulp');
const {src, dest, series, watch, parallel} = require('gulp');
const fs = require('fs');
const sass = require('gulp-sass')(require('sass'));
const pug = require('gulp-pug');
var browserSync = require('browser-sync').create();


// Carpetas desde el config
const configuracion = JSON.parse(fs.readFileSync("config.json", "utf8"));

// Pug
function htmlDesarrollo(done){
		return src(configuracion.directorios.pug.fuente)
			.pipe(pug({doctype: 'html', pretty: true}).on('error', error => {console.log('Error en pug: ' + error);}))
			.pipe(dest(configuracion.directorios.pug.destino.dev))
			.pipe(browserSync.reload({stream: true}));
}

function compilarSass() {
   return src('./sass/**/*.sass')
      .pipe(sourcemaps.init())
      .pipe(sass.sync({ outputStyle: 'compressed' }).on('error', sass.logError))
      // .pipe(sourcemaps.write('./maps'))
      .pipe(dest(configuracion.directorios.sass.destino.dev))
		.pipe(browserSync.stream());
};

function browserSyncDesarrollo(done){

	browserSync.init({
		injectChanges: true,
		server: {
			baseDir: "dist/dev",
			serveStaticOptions: {
				extensions: ['html']
			},
			directory: true
		},
		port: 3000
	});
	   
   let watcherHtml = watch(configuracion.directorios.pug.watcher);
   watcherHtml.on('change', function(path){htmlDesarrollo(path)});
	
	watch(configuracion.directorios.sass.watcher,     compilarSass);
   watch(configuracion.directorios.pug.recargar.dev).on('change', browserSync.reload);

   done();
}

exports.htmlDesarrollo = htmlDesarrollo;
exports.compilarSass   = compilarSass;

const compilarDesarrollo    = series(parallel( compilarSass, htmlDesarrollo), browserSyncDesarrollo);

exports.default = compilarDesarrollo;