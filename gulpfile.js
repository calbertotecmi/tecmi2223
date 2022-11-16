'use strict';

const gulp = require('gulp');
const {src, dest, series, watch, parallel} = require('gulp');
const fs = require('fs');
const sourcemaps = require('gulp-sourcemaps');
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
// Sass
function compilarSass() {
   return src('./sass/**/*.sass')
      .pipe(sourcemaps.init())
      .pipe(sass.sync({ outputStyle: 'compressed' }).on('error', sass.logError))
      .pipe(sourcemaps.write('./maps'))
      .pipe(dest(configuracion.directorios.sass.destino.dev))
		.pipe(browserSync.stream());
};
// Imagenes
function imagenesDesarrollo(){
	return src(configuracion.directorios.imagenes.fuente)
		.pipe(dest(configuracion.directorios.imagenes.destino.dev))
}
// fonts
function fontsDesarrollo(){
	return src(configuracion.directorios.fonts.fuente)
		.pipe(dest(configuracion.directorios.fonts.destino.dev))
}
// vendor all
function vendorAll(){
	return src(configuracion.directorios.vendor.fuente)
		.pipe(dest(configuracion.directorios.vendor.destino.dev))
}
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
	watch(configuracion.directorios.imagenes.fuente,     imagenesDesarrollo);
	watch(configuracion.directorios.fonts.fuente,     fontsDesarrollo);
	watch(configuracion.directorios.vendor.fuente,     vendorAll);
   watch(configuracion.directorios.pug.recargar.dev).on('change', browserSync.reload);

   done();
}

exports.htmlDesarrollo = htmlDesarrollo;
exports.compilarSass   = compilarSass;
exports.imagenesDesarrollo  = imagenesDesarrollo;
exports.fontsDesarrollo     = fontsDesarrollo;
exports.vendorAll     = vendorAll;

const compilarDesarrollo    = series(parallel( compilarSass, htmlDesarrollo, vendorAll, imagenesDesarrollo, fontsDesarrollo ), browserSyncDesarrollo);

exports.default = compilarDesarrollo;