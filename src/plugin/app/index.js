window.deviceEnv="web"
document.addEventListener('deviceready', function () {
    window.deviceEnv="app"

    // StatusBar.backgroundColorByHexString("#C0C0C0");
    // StatusBar.backgroundColorByHexString("#333");
    // StatusBar.hide();
    setTimeout(function() {
        navigator.splashscreen.hide();
        StatusBar.backgroundColorByHexString("#1d2531")
    }, 1000);
    StatusBar.overlaysWebView(false);



}, false);