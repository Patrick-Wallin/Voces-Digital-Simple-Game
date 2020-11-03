// Correct Sorted Order Answer
var questions = {};
questions['q1'] = 'Hay un muchacho y una muchacha en la clase de matemáticas.';
questions['q2'] = 'El maestro dice que los estudiantes necesitan un lápiz.';
questions['q3'] = 'Camila no tiene papel y Mateo tiene papel.';
questions['q4'] = 'Camila no tiene un libro de matemáticas y necesita un libro.';
questions['q5'] = 'Mateo no tiene un lápiz, no tiene una hoja de papel, y no tiene un libro.';
questions['q6'] = 'El maestro está furioso.';

// Save all the results that users made the orders
var resultQuestionsFromUsers = [];

// List all items under lists and new lists
var listDiv = document.getElementById("lists");
var newListDiv = document.getElementById("newLists");

// Keep trying how many items have been dragged to new list so we could check if it is incorrect or correct
var numberOfLeftItem = 0;

// Statistics
var numberOfCorrect = 0;
var totalTries = 0;

// Need to hide them while shuffling the order so users would not see the answer
listDiv.style.display = "none";

// produce Item div under lists based on number of items from the array above (correct sorted order answer)
for (const property in questions) {
    numberOfLeftItem++;

    var div = document.createElement('div');
    
    div.classList.add('item');
    div.classList.add('draggable');
    div.setAttribute('draggable', true);
    div.style.order = numberOfLeftItem;

    listDiv.append(div);

    div = document.createElement('div');
    
    div.classList.add('newItem');

    newListDiv.append(div);
}

// Produce event listener for all item under questions
var items = document.querySelectorAll('.item');
items.forEach(item => {
    item.addEventListener('dragstart', () => {
        item.classList.add('dragging');
    });
    item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
    });
});

// Produce event listener for new list that user move from regular list
var newItems = document.querySelectorAll('.newItem');
newItems.forEach(item => {
    item.addEventListener('dragover', e => {
        e.preventDefault();
    });

    item.addEventListener('drop', e => {
        e.preventDefault();
        if(item.innerHTML == "") {
            var dragItem = document.querySelector('.dragging');
            dragItem.setAttribute('draggable',false);
            dragItem.classList.remove('dragging');
            dragItem.classList.remove('draggable');
            dragItem.classList.add('strike-through');
            item.innerHTML = dragItem.innerHTML;
            numberOfLeftItem--;
            if(numberOfLeftItem == 0) {
                // if no more item to be dragged then check if the order is correct or not.
                setTimeout(function() { checkIfItIsCorrectOrder() }, 500);
            }
        }
    });
});

shuffle();

function checkIfItIsCorrectOrder() {
    totalTries++;

    var isItMatch = true;
    var result = [];

    // Check if the new list has correct order or not.
    for(var i = 0; i < Object.keys(questions).length; i++) {
        if(newItems[i].innerHTML != questions[Object.keys(questions)[i]]) {
            isItMatch = false;
        }

        // save the new list item into result
        result.push(newItems[i].innerHTML);        
    }

    resultQuestionsFromUsers.push(result);

    if(isItMatch == true) {
        numberOfCorrect++;
        alert('It is correct!');
    }else {
        alert('It is incorrect!');
        shuffle();
    }

    document.getElementById('correctCount').innerText = numberOfCorrect;
    document.getElementById('incorrectCount').innerText = totalTries-numberOfCorrect;
    document.getElementById('totalCount').innerText = totalTries;

    refreshResultScreen();
}

function shuffle() {
    // Copy the original questions to new object for doing randoms.
    var randomQuestions = Object.assign({}, questions);
    var currentIndex = Object.keys(questions).length;

    numberOfLeftItem = 0;

    listDiv.style.display = "none";

    while(currentIndex >= 1) {
        let randomPos = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // Need to include 'q' cause the object was given by Voces Digital
        let randomKeyName = 'q' + (randomPos+1);
        let keyName = 'q' + (currentIndex+1);
        tempValue = randomQuestions[keyName];

        randomQuestions[keyName] = randomQuestions[randomKeyName];
        randomQuestions[randomKeyName] = tempValue;
    }

    // Reset the questions to the list
    var items = document.querySelectorAll('.item');    
    items.forEach(item => {
        item.innerHTML = randomQuestions[Object.keys(randomQuestions)[numberOfLeftItem]];
        item.classList.remove('strike-through');
        item.setAttribute('draggable',true);
        item.classList.remove('dragging');
        item.classList.add('draggable');
        numberOfLeftItem++;
    });

    // Clear all new list
    var newItems = document.querySelectorAll('.newItem');
    newItems.forEach(item => {
        item.innerHTML = "";
    });
    
    listDiv.style.display = "block";
}

/* 
    Populate results into the screen
*/
function refreshResultScreen(){
    var resultDiv = document.getElementById("results");
    var lastResult = resultQuestionsFromUsers[resultQuestionsFromUsers.length-1];

    var div = document.createElement('div');
    var titleH2= document.createElement('h2');
    titleH2.innerHTML = "Result Try Number: " + resultQuestionsFromUsers.length;
    div.append(titleH2);

    var resultQuestionLoop = 0;
    lastResult.forEach(result => {
        resultQuestionLoop++;

        var lastDiv = document.createElement('div');
    
        lastDiv.innerHTML = resultQuestionLoop + ". " + result;
    
        div.append(lastDiv);
    });

    resultDiv.append(div);
}
