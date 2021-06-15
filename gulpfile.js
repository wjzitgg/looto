const path = require('path')
const gulp = require('gulp')
const fs = require('fs')
const chalk =require('chalk')
const sftp = require('gulp-sftp')
const spawn = require('child_process').spawn
const runSequence = require('gulp-run-sequence')
const htmlreplace =require('gulp-html-replace')
const config = require('./config/dev')

gulp.task('publishDev', function () {

    gulp.src(['./dist/**'],{base:'./',buffer: false})
        .pipe(sftp(config.sftp.dev))

});

gulp.task('publishTest', function () {

    gulp.src(['./dist/**'],{base:'./',buffer: false})
        .pipe(sftp(config.sftp.test))

});



const pathAndroid='./dist/android'
const pathIos='./dist/ios'

const emptyDir = function(fileUrl,delSelf){
    let files = [];
    if( fs.existsSync(fileUrl) ) {
        files = fs.readdirSync(fileUrl);
        files.forEach(function(file,index){
            var curPath = fileUrl + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // 文件夹继续递归
                emptyDir(curPath);
            } else { // 删除文件
                fs.unlinkSync(curPath);
            }
        });
        if(typeof delSelf == "undefined"||delSelf)
            fs.rmdirSync(fileUrl);
    }
}

gulp.task('buildWebResources',function(cb){
    //清空文件夹
    emptyDir('./dist',false)

    let workerProcess = spawn('npm',['run','build'],{shell: process.platform === 'win32'})

    workerProcess.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });

    workerProcess.stderr.on('data', function (data) {
        console.log('stdout: '+ data);
    });

    workerProcess.on('exit', function (code) {
        cb(code);
    });

    workerProcess.on('error', function (err) {
        console.log('error: ' + err);
    });

})

gulp.task('copyWebResources',function(){

    if(!fs.existsSync(pathAndroid)) fs.mkdirSync(pathAndroid)
    if(!fs.existsSync(pathIos)) fs.mkdirSync(pathIos)

    return gulp.src(['./dist/**'],{})
        .pipe(gulp.dest(pathAndroid))
        .pipe(gulp.dest(pathIos))
})

gulp.task('buildAndroid',function(){
    return gulp.src(['./src/app/android/**'],{})
        .pipe(gulp.dest(pathAndroid))
})

gulp.task('buildIos',function(){
    return gulp.src(['./src/app/ios/**'],{})
        .pipe(gulp.dest(pathIos))
})

gulp.task('addAndroidEntry',function(){
    return gulp.src(['./dist/android/index.html'],{})
        .pipe(htmlreplace({js:'cordova.js'}))
        .pipe(gulp.dest('./dist/android'))
})

gulp.task('addIosEntry',function(){
    return gulp.src(['./dist/ios/index.html'],{})
        .pipe(htmlreplace({js:'cordova.js'}))
        .pipe(gulp.dest('./dist/ios'))
})

/*--------------------Build------------------*/
gulp.task('build',function(cb){
    runSequence('buildWebResources','copyWebResources','buildAndroid','buildIos',['addAndroidEntry','addIosEntry'],function(){
        emptyDir(pathAndroid+'/android')
        emptyDir(pathAndroid+'/ios')
        emptyDir(pathIos+'/android')
        emptyDir(pathIos+'/ios')
        console.log(chalk.green("Build success！"))
        cb()
    })
})

//gulp.task(name[, deps], fn) 定义任务  name：任务名称 deps：依赖任务名称 fn：回调函数
//gulp.src(globs[, options]) 执行任务处理的文件  globs：处理的文件路径(字符串或者字符串数组)
//gulp.dest(path[, options]) 处理完后文件生成路径