var showLink = document.querySelector("#showLink");
console.log(showLink);


showLink.addEventListener('click', function () {
    console.log("estoy aquí");
    document.getElementById("showLink").setAttribute('style', 'display:none;');

});

document.getElementById("hideLink").addEventListener('click', function () {
    document.getElementById("showLink").setAttribute('style', 'display:block;');

});