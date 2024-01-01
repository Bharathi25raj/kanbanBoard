let addBtn = document.querySelector('.add-btn');
let taskBox = document.querySelector('.add-task-popup');
let mainCont = document.querySelector('.main-cont');
let uid = new ShortUniqueId();
let colorBoxes = document.querySelectorAll('.priority-color');
let colors = document.querySelectorAll('.color');
let color = ['red', 'lightblue', 'grey', 'black'];

let ticketArr = [];


//To recreate the tickets from local storage
if(localStorage.getItem('TaskArr')){
    let ticketArrStr = localStorage.getItem('TaskArr');
    ticketArr = JSON.parse(ticketArrStr);

    for(let i = 0; i < ticketArr.length; i++){
        let ticket = ticketArr[i];

        createTicket(ticket.value, ticket.pcolor, ticket.id);
    }
}


let priorityColor;
for(let i = 0; i < colorBoxes.length; i++){
    colorBoxes[i].addEventListener('click', function(e){

        for(let j = 0; j < colorBoxes.length; j++){
            colorBoxes[j].classList.remove('active');
        }

        colorBoxes[i].classList.add('active');

        priorityColor = colorBoxes[i].classList[1];
    })
}


let isTaskboxHidden = true;
//To hide and show task container on click of + icon
addBtn.addEventListener('click', function(e){ 
    if(isTaskboxHidden){
        taskBox.style.display = 'flex';
        isTaskboxHidden = false;
    } else {
        taskBox.style.display = 'none';
        isTaskboxHidden = true;
    }
});


let deleteBtn = document.querySelector('.remove-btn');
let isDeleteBtnActive = false;
//To make delete button active and inactive
deleteBtn.addEventListener('click', function(e){
    if(!isDeleteBtnActive){
        deleteBtn.style.color = 'red';
        isDeleteBtnActive = true;
    } else {
        deleteBtn.style.color = 'black';
        isDeleteBtnActive = false;
    }
});


let textArea = document.querySelector('.textBox');
//To add new tasks
textArea.addEventListener('keydown', function(e){
    let key = e.key;
    //console.log(e);
    if(key == 'Enter'){
        let taskName = e.target.value;
        createTicket(taskName, priorityColor);
        
        taskBox.style.display = 'none';
        isTaskboxHidden = true;
        textArea.value = "";
    } 
});



function createTicket(taskName, priority_Color, ticketId){

    let ticketCont = document.createElement('div');
    ticketCont.className = "ticket-cont";

    let id;

    if(ticketId){
        id = ticketId
    } else {
        id = uid.rnd();
    }

    ticketCont.innerHTML = `<div class='ticket-color ${priority_Color}'></div>
                            <div class='ticket-id'>#${id}</div> 
                            <div class='ticket-area'>${taskName}</div>
                            <div class='lock-unlock-btn'><i class="fa-solid fa-lock"></i></div>`;
                            //<i class="fa-solid fa-lock-open"></i>

    if(!ticketId){
        ticketArr.push({id: id, pcolor: priority_Color, value: taskName});
        updateLocalStorage();
    }

    mainCont.appendChild(ticketCont);

    


    //handle delete ticket
    ticketCont.addEventListener('click', function(e){
        if(isDeleteBtnActive){
            ticketCont.remove();
            let ticketIndex = ticketArr.findIndex(function(ticketObj){
                return ticketObj.id == id;
            })
            ticketArr.splice(ticketIndex, 1);
            updateLocalStorage();
        }
    });



    //handle lock unlock button
    let lockUnlockBtn = ticketCont.querySelector('.lock-unlock-btn i');
    let textAreaEdit = ticketCont.querySelector('.ticket-area');
    //console.log(lockUnlockBtn);
    lockUnlockBtn.addEventListener('click', function(e){

        console.log(e);

        if(lockUnlockBtn.classList.contains('fa-lock')){
            lockUnlockBtn.classList.remove('fa-lock');
            lockUnlockBtn.classList.add('fa-lock-open');
            textAreaEdit.setAttribute('contenteditable', 'true');
        } else {
            lockUnlockBtn.classList.remove('fa-lock-open');
            lockUnlockBtn.classList.add('fa-lock');
            textAreaEdit.setAttribute('contenteditable', 'false');
        }

        let ticketIndex = ticketArr.findIndex(function(ticketObj){
            return ticketObj.id == id;
        })

        ticketArr[ticketIndex].value = textAreaEdit.innerText;
        updateLocalStorage();

    });


    //To change the priority color of the ticket
    let ticket_color = ticketCont.querySelector('.ticket-color');

    ticket_color.addEventListener('click', function(e){

        let currentColor = ticket_color.classList[1];

        let idx = color.findIndex(function(col){
            return col == currentColor;
        })

        for(let i = 0; i < color.length; i++){
            let nextInd = (idx + 1) % color.length;
            let nextColor = color[nextInd];

            ticket_color.classList.remove(currentColor);
            ticket_color.classList.add(nextColor);

            let ticketIndex = ticketArr.findIndex(function(ticketObj){
                return ticketObj.id == id;
            })

            ticketArr[ticketIndex].pcolor = nextColor;
            updateLocalStorage();
        }
    });
}


//color filter
let filterColors = document.querySelectorAll('.color');
for(let i = 0; i < filterColors.length; i++){
    filterColors[i].addEventListener('click', function(e){

        let allTicketColors = document.querySelectorAll('.ticket-color');

        let selectedColor = filterColors[i].classList[1];

        for(let j = 0; j < allTicketColors.length; j++){

            let currentTicketColor = allTicketColors[j].classList[1];

            if(selectedColor == currentTicketColor){
                allTicketColors[j].parentElement.style.display = 'block';
            } else {
                allTicketColors[j].parentElement.style.display = 'none';
            }
        }
    })

    filterColors[i].addEventListener('dblclick', function(e){

        let allTicketColors = document.querySelectorAll('.ticket-color');
        for(let j = 0; j < allTicketColors.length; j++){
            allTicketColors[j].parentElement.style.display = 'block';
        }

    })
}



//Update local storage function
function updateLocalStorage(){
    let ticketArrStr = JSON.stringify(ticketArr);
    localStorage.setItem("TaskArr", ticketArrStr);
}