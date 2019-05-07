console.log("starting javascript...");

// JAVASCRIP BASICS
// variable declarations

var myName = "David";
var myAge = 39;
var ignasiAge = 32;
var ageDiff;
myColor = ["Red", "Green", "White", "Black"];



// show results

console.log(myName + " & " + myAge + " years old");
console.log(myAge + ignasiAge);
console.log(ageDiff);
ageDiff = myAge - ignasiAge;
// i'm older than 21??

if (myAge > 21) {
  console.log("You are older than 21");
} else {
  console.log("You are not older than 21");
}

//i'm older than ignasi??
switch (myAge > ignasiAge) {
  case true: {
    console.log("you are older than Ignasi");
    break;
  }
  case false: {
    if (myAge < ignasiAge) {
      console.log("you are younger than Ignasi");
      break;
    } else {
      console.log("you have the same age than Ignasi");
      break;
    }
  }
}

// JAVASCRIPT ARRAY FUNCIONS

// Exercise 1: Create an array with all the names of your class (including mentors).
// Sort the array alphabetically.  Print the first element of the array in the console.
// Print the last element of the array in the console.  Print all the elements of the array in the console.
// Use a "for" loop.

var ubiqumJava = ["Mijail", "Brian", "Daniel", "Danilo", "Jacobo", "David"];
var sortUbiqumJava = ubiqumJava.sort();

console.log(sortUbiqumJava[0]);
console.log(sortUbiqumJava[sortUbiqumJava.length - 1]);

var i;
for (i = 0; i < sortUbiqumJava.length; i++) {
  console.log(sortUbiqumJava[i]);
}

// Exercise 2: Create an array with all the ages of the students in your class.
// Iterate the array using a while loop, and then print every age in the console.
// Add a conditional inside the while loop to only print even numbers.  C
// hange the loop to use a "for" loop instead of a "while" loop.

var agesUbiqumJava = [24, 25, 26, 32, 35, 39];
var i = agesUbiqumJava.length;

while (i > 0) {
  //conditional inside the while loop to only print pair numbers
  if (agesUbiqumJava[i - 1] % 2 == 0) {
    console.log(agesUbiqumJava[i - 1]);
  }
  i--;
}

var x;

for (x = 0; x < i; x++) {
  if (agesUbiqumJava[i - 1] % 2 == 0) {
    console.log(agesUbiqumJava[i - 1]);
  }
}

//Exercise 3: Write a function which receives an array as a parameter and prints the lowest number in the array to the console

var exampleArray = [
  3,
  6,
  67,
  6,
  23,
  11,
  100,
  8,
  93,
  0,
  17,
  24,
  7,
  1,
  33,
  45,
  28,
  33,
  23,
  12,
  99,
  100
];

function lowestNumber(array) {
  var lowNum = array[0];
  for (var i = 1; i < array.length; i++) {
    if (array[i] < lowNum) {
      lowNum = array[i];
    }

  }
  //console.log(array.sort()[0]);
  console.log(lowNum);
  return;
}

lowestNumber(exampleArray);

//Exercise 4: Write a function which receives an array as a parameter and prints the biggest number in the array to the console.

function biggestNumber(array) {
  var bigNum = array[0];
  for (var i = 1; i < array.length; i++) {
    if (array[i] > bigNum) {
      bigNum = array[i];
    }

  }

  //console.log(array.sort()[array.length - 1]);
  console.log(bigNum);
  return;
}

biggestNumber(agesUbiqumJava);

// Exercise 5: Write a function which receives two parameters, an array and an index.
// The function will print the value of the element at the given position (one-based)
// to the console.

function getValueGivenPosition(array, number) {


  if (number <= array.length) {
    console.log(array[number]);
    return;
  } else {
    console.log("index error. Try a lower index than " + (array.length - 1));
    return;
  }
}

getValueGivenPosition(exampleArray, 10);

// Exercise 6: Write a function which receives an array and only prints the values that repeat.

function getRepeatValues(array) {
  var i = array.length - 1;
  var repeatValues = [];

  while (i >= 0) {
    for (x = 0; x < i; x++) {
      if (array[x] == array[i]) {
        // console.log(array[x]);
        repeatValues.push(array[x]);
      }
    }
    i--;
  }
  console.log(repeatValues);
  return;
}

getRepeatValues(exampleArray);

//Exercise 7: Write a simple JavaScript function to join all elements of the following array into a string.

function changeArrayToString(array) {
  var x;
  x = array.join();
  console.log(x);
  return;
}

changeArrayToString(myColor);

// JAVASCRIPT STRING FUNCTIONS

//Exercise 1: Write a JavaScript function that reverses a number. For example, if x = 32443 then the output should be 34423

function reverseNumber(_number) {
  //number to a string
  var y = _number.toString();
  //declaration and initial values
  var j = y.length - 1;
  var z = y[j];
  while (j > 0) {
    z += y[j - 1];
    j--;
  }
  //string to a number
  z = Number(z);
  console.log(z);
  return;
}
var num = 166778899;
reverseNumber(num);

// Exercise 2: Write a JavaScript function that returns a string in alphabetical order.
// For example, if x = 'webmaster' then the output should be 'abeemrstw'.
// Punctuation and numbers aren't passed in the string.
function toSortString(str) {
  var str = str
    .split("")
    .sort()
    .join("");

  //another way after sort
  //.toString()
  //.replace(/,/g, "");

  console.log(str);
  return;
}

toSortString("webmaster");

// Exercise 3: Write a JavaScript function that converts the first letter of every word to uppercase.
// For example, if x = "prince of persia" then the output should be "Prince Of Persia".

function makeFirstLetterUper(str) {
  str = str.toLowerCase().split(" ");
  var newStr = [];

  // y[0] = x[0].replace(x[0].charAt(0), x[0].charAt(0).toUpperCase());
  // y[1] = x[1].replace(x[1].charAt(0), x[1].charAt(0).toUpperCase());
  // y[2] = x[2].replace(x[2].charAt(0), x[2].charAt(0).toUpperCase());

  // console.log(y);

  for (i = 0; i < str.length; i++) {
    var replacedLetter = str[i].replace(str[i].charAt(0), str[i].charAt(0).toUpperCase());
    newStr.push(replacedLetter);
  }

  newStr = newStr.join(" ");
  console.log(newStr);
  return;
}
let frase = "I have not failed. I've just found 10,000 ways that won't work"
makeFirstLetterUper(frase);

// Exercise 4: Write a JavaScript function that finds the longest word in a phrase.
// For example, if x = "Web Development Tutorial", then the output should be "Development".

function showLongestWord(str) {
  str = str.split(" ");
  var result = str[0];

  for (i = 1; i < str.length; i++) {
    if (result.length < str[i].length) {
      result = str[i];
    }
  }
  return result;
}
console.log(showLongestWord("The best way to predict the future is to invent it"));





// EXTRA EXERCISES

// I need a function that is able to put elements inside a list in my html.
// - First of all you need a list in your HTML. Feel free to create it from HTML or in JS.
// - The second thing is to create a function that receives an Array like a parameter.
// - For every value of the array you need a different list item in html.

// For example:

//     myFunction(['color1', 'color2', 'color3']);


function addListItem(array) {
  var result = [];

  for (var i = 0; i < array.length; i++) {
    result.push("<li>" + array[i] + "</li>");
    nresult = result.join("");
  }
  document.getElementById("ulist").innerHTML = nresult;
}

addListItem2(exampleArray);


//not using innerHTML-->with createElement and append.

function addListItem2(array) {
  var ul = document.getElementById("ulist");
  for (var i = 0; i < array.length; i++) {
    var li = document.createElement("li");
    li.append(array[i]);
    ul.append(li);
  }
}


// Make a function for show a random image in a div in the center of the page.
// You have the images in the 'images' folder in the root directory.

// You need a 'Randomize' button under the div with the image that
// makes the action...


// document.getElementById("randomButton").addEventListener("click", function () {
//   var inxRdm = Math.floor((Math.random() * 5) + 1) //random 1-5;
//   var myImage = "image" + inxRdm + ".jpeg"; //on supose 5 images in the root, called image1, image2, image3... 
//   console.log("<img src='" + myImage + "'>");
//   document.getElementById("images").className = "container text-center";
//   document.getElementById("images").innerHTML = "<img src='" + myImage + "' style='text-align:center'>";
// });


document.getElementById("randomButton").addEventListener("click", function () {
  var images = document.getElementById("images");
  var inxRdm = Math.floor((Math.random() * 5) + 1);
  var image = document.createElement("img");
  image.setAttribute("src", "image" + inxRdm + ".jpeg");
  images.setAttribute("class", "container text-center")
  images.append(image);
});

// I need a button that every time is clicked, adds a new row in a table.
// But I need that adds a new row with a random color background.

// It's sounds hard but remember to think in little.


//############# my 1st version ##################//

// var myRow = [];
// document.getElementById("randomButtonColor").addEventListener("click", function () {
//   var randomColor = Math.floor(Math.random() * 16777215).toString(16); //random color;
//   myRow.push("<tr style='background-color:#" + randomColor + ";'><td>Nueva Fila</td></tr>");
//   document.getElementById("myTable").innerHTML = myRow.join("");
// });


document.getElementById("randomButtonColor").addEventListener("click", function () {
  var myTable = document.getElementById("myTable");
  console.log(myTable);
  var randomColor = Math.floor(Math.random() * 16777215).toString(16); //random color;
  var myTr = document.createElement("tr");
  var myTd = document.createElement("td");
  myTd.innerHTML = "color";
  myTr.append(myTd);
  myTr.setAttribute("style", "background-color: #" + randomColor + ";'");
  myTable.append(myTr);
});


// In your HTML create an input field, a button with the text "Add" and an empty div under them.

// Create a function for every time that I press the Add button, the value of the input
// have to be appended in the empty div.
// If the input is empty (witouth any text), and the user press the Add button, an alert
// should be shown with an advertising text.

// Good luck.


//############# my 1st version ##################//


// var textAdded = []
// document.getElementById("buttonAdd").addEventListener("click", function () {
//   var myText = document.getElementById("myInput").value;

//   if (myText != "" | null) {
//     textAdded.push(myText);
//     var showText = textAdded.join(" ");
//     document.getElementById("textIn").innerHTML = showText;
//     document.getElementById("myInput").value = "";

//     return;
//   } else {
//     window.alert("No text added");
//     return;
//   }
// });

document.getElementById("buttonAdd").addEventListener("click", function () {
  var myText = document.getElementById("myInput").value;
  if (myText != "" | null) {
    var myP = document.createElement("p");
    myP.append(myText);
    document.getElementById("textIn").append(myP);
    document.getElementById("myInput").value = "";
    return;
  } else {
    window.alert("No text added");
    return;
  }
});


// Create a function to fill an array with 100 random numbers. You can't create it manually.

// After this, make another function that separate the numbers of the first array in two new arrays:
//  var oddNumbers = [];
//  var evenNumbers = [];

// You have to console.log these two arrays after create them.

//############# my 1st version ##################//

function createNumbers() {

  var array = []
  for (var i = 0; i < 100; i++) {
    array.push(Math.floor(Math.random() * 99));
  }
  return array;
}

function separateOddEvenNumbers() {
  var myArray = createNumbers();
  var oddNumbers = [];
  var evenNumbers = [];
  for (var i = 0; i < myArray.length; i++) {
    if (myArray[i] % 2 == 0) {
      oddNumbers.push(myArray[i]);
    } else {
      evenNumbers.push(myArray[i]);
    }
  }
  console.log(oddNumbers);
  console.log(evenNumbers);
  return;
}




separateOddEvenNumbers();