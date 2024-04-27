/**
 *  Author: Jacob Callicott
    ISU Netid : jcallico@iastate.edu
    Date : Feburary 25th, 2024
 */

loadAll();

function loadSpecific(){
    var robotId = document.getElementById('specificRobot').value;
    fetch("http://localhost:8081/" + robotId)
    .then(response => response.json())
    .then(robot => loadMovies(robot));
}

function loadAll(){
    fetch("http://localhost:8081/listRobots")
    .then(response => response.json())
    .then(myMovies => loadMovies(myMovies));
}

function addRobot() {
    const values = [
        "4",
        "jacob robot",
        "10000",
        "this is the jacob robot",
        "https://robohash.org/jacob"
    ];

    const newDocument = {
        "id": values[0],
        "name": values[1],
        "price": values[2],
        "description": values[3],
        "imageUrl": values[4]
    };

    fetch('http://localhost:8081/addRobot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newDocument)
    })
    .then(response => response.json());
    loadAll();
}
function deleteOneRobot() {
    // Fetch the value from the input field
    let id = document.getElementById("deleteRobotById").value;
    console.log(id);
    fetch(`http://localhost:8081/deleteRobot/${id}`, {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(
            { "id":id}
        )
    })
    .then(response => response.json())
    .then(deleteThisRobot => {deleteOneRobotById(id)});
}

function deleteOneRobotById(id) {
    const elementToDelete = document.getElementById(id);
    if (elementToDelete) {
        elementToDelete.remove();
    }
}

function updateOneRobot() {
    // Fetch the value from the input field
    let id = document.getElementById("updateRobotById").value;
    console.log(id);
    fetch(`http://localhost:8081/updateRobot/${id}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(
            {
                "name": "Robot Abraham ALDACO-GASTELUM",
                "price": 100.90,
                "description": "I robot is one example of an image for my exercise",
                "imageUrl": "https://robohash.org/Abraham"
            }
        )
        })
    .then(response => response.json())
    .then(updateThisRobot => {updateOneRobotById(id)});
}

function updateOneRobotById(id)
{
    var card = document.getElementById(id);
    robotName="Robot Abraham ALDACO-GASTELUM";
    price=100.90;
    description="I robot is one example of an image for my exercise";
    imageUrl="https://robohash.org/Abraham";

    card.innerHTML = `
    <div id=${id} class="card shadow-sm">
    <img src=${imageUrl} class="card-img-top" alt="..."></img>
        <div class="card-body">
            <p class="card-text"> <strong>${id} ${robotName}</strong>, $${price}<br>${description}</p>
            <div class="d-flex justify-content-between align-items-center">
            </div>
        </div>
    </div>
    `;
}



function loadMovies(robotArg) {
    // Find the element “col” in HTML
    console.log(robotArg);
    
    var CardMovie = document.getElementById("col");

    CardMovie.innerHTML = "";
    
   var cards = [];
   var card;
   if(!Array.isArray(robotArg)){
        myMovies = [robotArg];
   }
   else{
        var myMovies = robotArg.slice();
   }
    // Read every movie from the array
    for (var i = 0; i<myMovies.length; i++){

        let id = myMovies[i].id;
        let name = myMovies[i].name;
        let price = myMovies[i].price;
        let description = myMovies[i].description;
        let imageUrl = myMovies[i].imageUrl;
            // create a new HTML div division
        let AddCardMovie = document.createElement("div");
        // add class = “col” to new division for Bootstrap
        AddCardMovie.classList.add("col");
        // create Bootstrap card
        AddCardMovie.innerHTML = `
        <div id=${id} class="card shadow-sm">
        <img src=${imageUrl} class="card-img-top" alt="..."></img>
            <div class="card-body">
                <p class="card-text"> <strong>${id} ${name}</strong>, $${price}<br>${description}</p>
                <div class="d-flex justify-content-between align-items-center">
                </div>
            </div>
        </div>
        `;
        // append new division
        CardMovie.appendChild(AddCardMovie);

    
        let ccard = document.getElementById(card);
        cards.push(ccard);


    } // end of for
    console.log(cards);
} // end of function
