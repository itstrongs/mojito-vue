export default {
    isMobile() {
        return !!navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
    },

    openFile(url) {
        console.log("openFile url = ", url);
        window.open(url);
    }
}
