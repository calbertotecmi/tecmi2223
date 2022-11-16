"use strict";

const gulp = require('gulp');
const {src, dest, series, watch, parallel} = require('gulp');
const fs = require('fs');
const prefixer = require("gulp-autoprefixer");
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));
const babel = require('gulp-babel');
const pug = require('gulp-pug');
let browserSync = require('browser-sync').create();

// Carpetas desde el config
const configuracion = JSON.parse(fs.readFileSync("config.json", "utf8"));

// Opciones para el prefix
const prefixerOptions = {
	overrideBrowserslist: ['last 3 versions']
};
// Pug
function htmlDesarrollo(done){
		return src(configuracion.directorios.pug.fuente)
			.pipe(pug({doctype: 'html', pretty: true}).on('error', error => {console.log('Error en pug: ' + error);}))
			.pipe(dest(configuracion.directorios.pug.destino.dev))
			.pipe(browserSync.reload({stream: true}));
}
// Sass
function compilarCssDesarrollo() {
   return src('./sass/**/*.sass')
		.pipe(sourcemaps.init())
      .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(prefixer(prefixerOptions))
      .pipe(sourcemaps.write('./maps'))
      .pipe(dest(configuracion.directorios.sass.destino.dev))
		.pipe(browserSync.stream());
}
// Javascript
function jsDesarrollo(){
	return src('./js/**/*.js')
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.on('error', function(error){console.log(error.toString())})
		.pipe(dest(configuracion.directorios.js.destino.dev))
		.pipe(browserSync.stream());
}
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
// vendor all (slick, plugins...)
function vendorAll(){
	return src(configuracion.directorios.vendor.fuente)
		.pipe(dest(configuracion.directorios.vendor.destino.dev))
}

// Browser sync
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
	
	watch(configuracion.directorios.sass.watcher,     compilarCssDesarrollo);
	watch("./js/**/*.js",                           jsDesarrollo);
	watch(configuracion.directorios.imagenes.fuente,     imagenesDesarrollo);
	watch(configuracion.directorios.fonts.fuente,     fontsDesarrollo);
	watch(configuracion.directorios.vendor.fuente,     vendorAll);
   watch(configuracion.directorios.pug.recargar.dev).on('change', browserSync.reload);

   done();
}

exports.htmlDesarrollo = htmlDesarrollo;
exports.compilarCssDesarrollo   = compilarCssDesarrollo;
exports.jsDesarrollo        = jsDesarrollo;
exports.imagenesDesarrollo  = imagenesDesarrollo;
exports.fontsDesarrollo     = fontsDesarrollo;
exports.vendorAll     = vendorAll;

const compilarDesarrollo    = series(parallel( compilarCssDesarrollo, jsDesarrollo, htmlDesarrollo, vendorAll, imagenesDesarrollo, fontsDesarrollo ), browserSyncDesarrollo);
exports.default = compilarDesarrollo;