//**************************************//
//	Breathe: a breathing exercise app	//
//	Written by Nathan Denno, 2023    	//
//**************************************//

///////////////////////////////
//            VARS           //
///////////////////////////////

const container = document.querySelector('#container');
const breathAction = document.querySelector('#breathaction');
const count = document.querySelector('#count');

const breatheBtn = document.querySelector('#breathebutton');
const stopBtn = document.querySelector('#stop');
const presetMenu = document.querySelector("#presets");

const action1 = document.querySelector('#action1');
const action2 = document.querySelector('#action2');
const action3 = document.querySelector('#action3');
const action4 = document.querySelector('#action4');

const action1Length = document.querySelector('#act1duration');
const action2Length = document.querySelector('#act2duration');
const action3Length = document.querySelector('#act3duration');
const action4Length = document.querySelector('#act4duration');

const act1Text = document.querySelector('output.act1text');
const act2Text = document.querySelector('output.act2text');
const act3Text = document.querySelector('output.act3text');
const act4Text = document.querySelector('output.act4text');

const numCycles = document.querySelector('#numcycles');
const numCyclesText = document.querySelector('#numcyclestext');
const numCyclesInt = document.querySelector("output.numcyclestext");

const formActions = document.querySelector('#actions');


//Set some initial values
let actionCount = 0;
let cycleCount = 0;
act1Text.innerHTML = action1Length.value;
act2Text.innerHTML = action2Length.value;
act3Text.innerHTML = action3Length.value;
act4Text.innerHTML = action4Length.value;
numCyclesInt.innerHTML = numCycles.value;



//set transition times for elements
count.style.transition = "all 2s"
breathAction.style.transition = "all 2s"
document.body.style.transition = "all 3s"
formActions.style.transition = "all 1s"
stopBtn.style.transition = "all 1s"


//////////////////////////////
//       FUNCTIONS          //
//////////////////////////////

//The main function of the program
function breathe(list, numCycles=1){
    document.body.style.backgroundColor = 'rgb(63, 94, 94)'
    count.innerText = ""
    count.classList.replace('display-4', 'display-1');
    count.classList.remove('text-warning');
    count.style.color= 'white'
    count.style.transform = "translateY(200px) scale(105%)"
    breathAction.style.transform = "translateY(200px)"
    breathAction.classList.replace('display-3', 'display-4');
    breathAction.classList.replace('text-primary', 'text-warning')
    formActions.style.display = 'none'
    actionCount = 0;
    cycleCount = 0;

    // 2 seconds for user to get ready
    setTimeout(function(){
        stopBtn.style.display = 'block';
        stopBtn.style.position = "fixed";   // keep it fixed at the bottom of the screen
        stopBtn.style.bottom = "10px" 
             
        //the main counting loop
        const intervalId = setInterval(function(){
            if (actionCount >= list.length){
                cycleCount++;
                if (cycleCount >= numCycles){
                    resetScreen(intervalId);
                    return;
                }
                actionCount = 0; 
            }
            if (actionCount < list.length){
                count.innerText = `${list[actionCount].duration}`;
                breathAction.innerText = `${list[actionCount].action}`;
            }
            actionCount++;
        },1000)
    },2000);
    }

//Creates a list of breathingAction objects
function createObjects(){
    let list = [];
    let a1 = new breathingAction(action1.options[action1.selectedIndex].value, parseInt(action1Length.value));
    let a2 = new breathingAction(action2.options[action2.selectedIndex].value, parseInt(action2Length.value));

    putIntoList(a1, list, 0);
    putIntoList(a2, list, a1.duration);

    if (action3.options[action3.selectedIndex].value != 'None' && action3Length.value != 0){
        let a3 = new breathingAction(action3.options[action3.selectedIndex].value, parseInt(action3Length.value));
        isThirdAction = true;
        putIntoList(a3, list, a1.duration+a2.duration);

        if (action4.options[action4.selectedIndex].value != 'None' && action4Length.value != 0){
            let a4= new breathingAction(action4.options[action4.selectedIndex].value, parseInt(action4Length.value));
            putIntoList(a4, list, a1.duration+a2.duration+a3.duration);
        }
    }
    return list;
}

//Creates a list of breathingAction objects from the preset menu
function createObjectsFromPreset(objectList){
    let list = []
    let objectListLength = objectList.length;
    let a1 = objectList[0];
    let a2 = objectList[1];

    putIntoList(a1, list, 0);
    putIntoList(a2, list, a1.duration);

    if (objectListLength >=3){
        let a3 = objectList[2];
        putIntoList(a3, list, a1.duration+a2.duration);

        if (objectListLength == 4){
            let a4 = objectList[3];
            putIntoList(a4, list, a1.duration+a2.duration+a3.duration);
        }
    }
     return list;
}

//Constructor for breathingAction objects
function breathingAction(action, duration){
    this.action = action;
    this.duration = duration;
}

//Puts a breathingAction object into a new list.
//A unique object is created for each step of the action,
//i.e., if "Inhale" has a value of 4, there will be four 
//objects created with the same action ("Inhale") but different duration values (4,3,2,1).
function putIntoList(action, list, startIndex){
    if (action.duration === 0 || action.action == 'none'){
        return;
    }
    let j = 0;
    for (let i = startIndex; i < action.duration + startIndex; i ++){
        list[i] = new breathingAction(action.action,action.duration - j);
        j++;
    }
    return list;
}
//Resets the screen to the initial page settings
function resetScreen(intervalId='intervalId'){
    actionCount = 1000; //triggers the breathe() function to stop the count
    cycleCount = 1000;
    breathAction.innerText = '/Breathe/';
    clearInterval(intervalId);
    document.body.style.backgroundColor = 'white'
    count.classList.replace('display-1', 'display-4');
    count.style.color= 'black'
    count.innerText='';
    breathAction.classList.replace('text-warning', 'text-primary')
    breathAction.classList.replace('display-4', 'display-3')
    count.style.transform = "translateY(0px)"
    breathAction.style.transform = "translateY(0px)"
    stopBtn.style.display="none"
    setTimeout(function(){formActions.style.display = 'block'},2000);
    breatheBtn.disabled = false;
}

//displays a list of all the actions in the actionList
function printList(actionList){
    for (let i = 0; i < actionList.length; i ++){
        console.log(`${actionList[i].action}: ${actionList[i].duration}`);
    }
}
    
////////////////////////////////
//       EVENT LISTENERS      //
///////////////////////////////

numCycles.addEventListener('input', function(){
    numCyclesInt.value = this.value;
    if (this.value == 1){
        numCyclesText.innerText = 'cycle';
    }
    else{
        numCyclesText.innerText = 'cycles';
    }
})

//works but needs to be condensed
breatheBtn.addEventListener('click', function(){
    if (presetMenu.value == 'none'){
        let actionList = createObjects();
        let cycles = parseInt(numCycles.value);
        breatheBtn.disabled= true;
        breathe(actionList, cycles);
        //printList(actionList);
        let sessionLength = actionList.length*cycles;
        let sessionMinutes = sessionLength;
        let remainder = sessionMinutes%60;
        sessionMinutes = parseInt(sessionMinutes/60);
        console.log(` Session length: ${sessionMinutes} minutes and ${remainder} seconds`)
    }
    else{
        let presetChoice = eval(presetMenu.value);
        let actionList = createObjectsFromPreset(presetChoice);
        let cycles = parseInt(numCycles.value);
        breatheBtn.disabled= true;
        breathe(actionList, cycles);
        //printList(actionList);
        let sessionLength = actionList.length*cycles;
        let sessionMinutes = sessionLength;
        let remainder = sessionMinutes%60;
        sessionMinutes = parseInt(sessionMinutes/60);
        console.log(` Session length: ${sessionMinutes} minutes and ${remainder} seconds`)
    }
    
  
});

action1Length.addEventListener('input', function(){
    act1Text.value = this.value;
    presetMenu.value = "none";

    //console.log(this.value);
});

action2Length.addEventListener('input', function(){
    act2Text.value = this.value;
    presetMenu.value = "none";
    //console.log(this.value);
});

action3Length.addEventListener('input', function(){
    act3Text.value = this.value;
    presetMenu.value = "none";
    //console.log(this.value);
});

action4Length.addEventListener('input', function(){
    act4Text.value = this.value;
    presetMenu.value = "none";
    //console.log(this.value);
});

stopBtn.addEventListener('click', function(){
    resetScreen();
})



////////////////////////////////
//       PRESET EXERCISES     //
///////////////////////////////

const boxFour = [new breathingAction('Inhale',4),
                new breathingAction('Hold',4),
                new breathingAction('Exhale',4),
                new breathingAction('Hold',4)];

const boxSix = [new breathingAction('Inhale',6),
                new breathingAction('Hold',6),
                new breathingAction('Exhale',6),
                new breathingAction('Hold',6)];

const fourSevenEight = [new breathingAction('Inhale',4),
                new breathingAction('Hold',7),
                new breathingAction('Exhale',8)];

const fourTwoEight = [new breathingAction('Inhale',4),
                new breathingAction('Hold',2),
                new breathingAction('Exhale',8)];

const resonantFive = [new breathingAction('Inhale',5),
                new breathingAction('Exhale',5)];
