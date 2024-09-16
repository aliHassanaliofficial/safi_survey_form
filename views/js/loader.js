$(window).on("load", function () {
    setTimeout(function () {
        $(".loader").fadeToggle(1000);
        $(".data").fadeIn(1000);
    }, 1000);
});