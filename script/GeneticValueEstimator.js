var generationNr = 1;
var populationNr = 0;
var individualId = 0;
var currIndividuals = [];
var prevIndividuals = [];

var wordLength = 5;

//individual = {no:, val:, code:};


applyInputs = () => {
    clearVariables();
    populationNr = parseInt(document.getElementById("population-size").value);
    for(let i=0;i<populationNr;i++){
        let val = parseInt(Math.random()*31);
        currIndividuals.push({no:++individualId, val:val, code:("0000"+val.toString(2)).slice(-5)});
    }
    renderTable();
}
renderTable = () => {
    let tableHTML = "";
    let currValSum = sumArr(currIndividuals);
    let prevValSum = sumArr(prevIndividuals);
    tableHTML += "<tr><th>no.</th><th>code</th><th>val</th><th>%</th><th>no.(prev)</th><th>code(prev)</th><th>val(prev)</th><th>%(prev)</th></tr>";
    for(let i=0;i<populationNr;++i){
        tableHTML += "<tr><td>"+currIndividuals[i].no+"</td><td>"+currIndividuals[i].code+"</td><td>"+currIndividuals[i].val+"</td><td>"+(Math.pow(currIndividuals[i].val,3)/currValSum).toFixed(2)+"</td>";
        if(prevIndividuals.length!=0){
            tableHTML += "<td>"+prevIndividuals[i].no+"</td><td>"+prevIndividuals[i].code+"</td><td>"+prevIndividuals[i].val+"</td><td>"+(prevIndividuals[i].val*prevIndividuals[i].val/currValSum).toFixed(2)+"</td></tr>";
        }
    }
    tableHTML += "<tr><td>SUM</td><td></td><td>"+currValSum+"</td><td>100</td><td>SUM</td><td></td><td>"+prevValSum+"</td><td>100</td></tr>";
    document.getElementById("population-table").innerHTML = tableHTML;
}
nextStep = () => {
    prevIndividuals = currIndividuals;
    let currValSum = sumArr(currIndividuals);
    //fill procreation chance array
    let procreationChanceArray = [];
    let sumPercentage = 0;
    for(let i=0;i<populationNr;++i){
        sumPercentage += Math.pow(currIndividuals[i].val,3)/currValSum;
        procreationChanceArray.push({individual:currIndividuals[i],percentage:sumPercentage});
    }
    //draw indyviduals
    let newIndividuals = [];
    for(let i=0;i<populationNr;++i){
        let drawVal = Math.random();
        for(let j=0;j<populationNr;++j){
            if(drawVal<procreationChanceArray[j].percentage){
                newIndividuals.push(procreationChanceArray[j].individual);
                break;
            }
        }
    }
    //create new generation
    currIndividuals = [];
    for(let i=0;i<populationNr;i+=2){
        let slicePos = parseInt(Math.random()*(wordLength-1))+1;
        let a1 = newIndividuals[i].code.slice(0,slicePos);
        let a2 = newIndividuals[i].code.slice(slicePos,wordLength);
        
        let b1 = newIndividuals[i+1].code.slice(0,slicePos);
        let b2 = newIndividuals[i+1].code.slice(slicePos,wordLength); 

        let newCodeA = a1+b2;
        let newCodeB = b1+a2;

        //mutation (1%)
        if(Math.random()<0.01){
            console.log("Nastąpiła mutacja");
            let mutationPos = parseInt(Math.random()*10);
            if(mutationPos < 5){
                //mutate A
                let charToSet = newCodeA.charAt(mutationPos) === "0" ? "1" : "0";
                newCodeA = setCharAt(newCodeA,mutationPos,charToSet);
            }else{
                //mutate B
                let charToSet = newCodeB.charAt(mutationPos-5) === "0" ? "1" : "0";
                newCodeB = setCharAt(newCodeB,mutationPos-5,charToSet);
            }
        }

        currIndividuals.push({no:++individualId, val:parseInt(newCodeA,2), code:newCodeA});
        currIndividuals.push({no:++individualId, val:parseInt(newCodeB,2), code:newCodeB});
    }

    //generation var increment
    generationNr+=1;
    document.getElementById("generation-nr").innerHTML = "Generation: " + generationNr;

    renderTable();
}
setCharAt = (str,index,chr) => {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}
clearVariables = () => {
    currIndividuals = [];
    prevIndividuals = [];
    generationNr = 1;
    populationNr = 0;
    document.getElementById("generation-nr").innerHTML = "Generation: " + generationNr;
}
sumArr = (arr) => {
    let sum = 0;
    arr.forEach(element => {
        sum += Math.pow(element.val,3);     //kwadrat dla lepszych efektow
    });
    return sum;
}