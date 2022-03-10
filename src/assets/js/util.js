/**
 * SCROLLING ANIMATION
 */
const nameAnimation = "animate__zoomIn";
// Revisar scroll
var isInViewport = function(elem) {
    var distance = elem.getBoundingClientRect();
    var iHeight = (window.innerHeight || document.documentElement.clientHeight);
    // var iWidth = window.innerWidth || document.documentElement.clientWidth;
    // console.log(distance.top +"<="+iHeight);
    /* console.log(distance.top) */
    return (
        distance.top <= iHeight
        //distance.left >= 0 &&
        // distance.bottom <= iHeight &&
        //distance.right <= iWidth
    );
};
//Funcion reset animation
var resetActionAnimation = function(){
    //Init
    var findMe = jQuery('.'+nameAnimation);
    // console.log('resetActionAnimation');
    jQuery.each( findMe, function(i, el){
        // console.log("entra y remueve")
        el.classList.remove(nameAnimation);
        el.classList.add("animatedRec");
    });
}
//Función para buscar elementos forEach
var doActionAnimation = function(findMe){
    // findMe.forEach(element => {
    //     // console.log(element);
    //     //for each .thisisatest
    //     if (isInViewport(element)) {
    //         //if in Viewport
    //         element.classList.remove("animatedRec");
    //         element.classList.add("animate__zoomIn");
    //     }
    // });
    //JQUERY
    //Animation
    jQuery.each( findMe, function(i, el){
        // console.log(el);
        if(isInViewport(el)){
            // console.log("entra y remueve")
            el.classList.remove("animatedRec");
            // el.classList.add("animate__slow");
            el.classList.add(nameAnimation);
        }
    });
}
// read the link on how above code works
// setTimeout(function(){
//     var findMe = document.querySelectorAll('.animatedRec');

//     setTimeout(function(){
//         //Ejecutar primera vez
//         doActionAnimation(findMe);
//         console.log(findMe);
//     }, 1000);

//     window.addEventListener('scroll', function(event) {
//         // add event on scroll
//         doActionAnimation(findMe);
//     }, false);
// }, 30);