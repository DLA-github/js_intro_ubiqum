console.log("starting javascript...");

// JAVASCRIP BASICS
// variable declarations

var myName = "David";
var myAge = 39;
var ignasiAge = 32;
var ageDiff;
myColor = ["Red", "Green", "White", "Black"];

ageDiff = myAge - ignasiAge;

// show results

console.log(myName + " & " + myAge + " old");
console.log(myAge + ignasiAge);
console.log(ageDiff);

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
  console.log(array.sort()[0]);
  return;
}

lowestNumber(exampleArray);

//Exercise 4: Write a function which receives an array as a parameter and prints the biggest number in the array to the console.

function biggestNumber(array) {
  console.log(array.sort()[array.length - 1]);
  return;
}

biggestNumber(agesUbiqumJava);

// Exercise 5: Write a function which receives two parameters, an array and an index.
// The function will print the value of the element at the given position (one-based)
// to the console.

function getValueGivenPosition(array, i) {
  if (i <= array.length) {
    console.log(array[i]);
    return;
  } else {
    console.log("index error. try an index below " + (array.length - 1));
    return;
  }
}

getValueGivenPosition(exampleArray, 10);

// Exercise 6: Write a function which receives an array and only prints the values that repeat.

function getRepeatValues(array) {
  var i = array.length - 1;
  var x;
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

function reverseNumber(x) {
  //number to a string
  var y = x.toString();

  //declaration and initial values
  var j = y.length;
  var z = y[y.length - 1];
  while (j - 1 > 0) {
    z += y[j - 2];
    j--;
  }
  //string to a number
  z = Number(z);
  console.log(z);
  return;
}
var num = 32443;
reverseNumber(num);

// Exercise 2: Write a JavaScript function that returns a string in alphabetical order.
// For example, if x = 'webmaster' then the output should be 'abeemrstw'.
// Punctuation and numbers aren't passed in the string.
function toSortString(x) {
  var x = x
    .split("")
    .sort()
    .toString()
    .replace(/,/g, "");
  console.log(x);
  return;
}

toSortString("webmaster");

// Exercise 3: Write a JavaScript function that converts the first letter of every word to uppercase.
// For example, if x = "prince of persia" then the output should be "Prince Of Persia".

function firstLetterUper(x) {
  x = x.toLowerCase().split(" ");
  console.log(x);
  var i;
  var y = [];

  // y[0] = x[0].replace(x[0].charAt(0), x[0].charAt(0).toUpperCase());
  // y[1] = x[1].replace(x[1].charAt(0), x[1].charAt(0).toUpperCase());
  // y[2] = x[2].replace(x[2].charAt(0), x[2].charAt(0).toUpperCase());

  // console.log(y);

  for (i = 0; i < x.length; i++) {
    y[i] = x[i].replace(x[i].charAt(0), x[i].charAt(0).toUpperCase());
  }

  y = y.join(" ");
  console.log(y);
  return;
}

firstLetterUper(
  "I have not failed. I've just found 10,000 ways that won't work"
);

// Exercise 4: Write a JavaScript function that finds the longest word in a phrase.
// For example, if x = "Web Development Tutorial", then the output should be "Development".

function longestWord(x) {
  x = x.split(" ");
  var i;
  var result = x[0];

  for (i = 1; i < x.length; i++) {
    if (result.length < x[i].length) {
      result = x[i];
    }
  }
  return result;
}
console.log(longestWord("The best way to predict the future is to invent it"));
