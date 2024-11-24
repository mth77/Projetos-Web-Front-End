let button = document.getElementById("addTaskBtn");
let list = document.getElementById("taskList");
let input = document.getElementById("taskInput");

button.addEventListener("click", function() {
    if (input.value === ""){
        alert("Atribua algum título à tarefa!!");
    } else{ 
    let novaTarefa = document.createElement("li"); 
    let btnTarefa = document.createElement("button");
 
    novaTarefa.textContent = input.value;
    btnTarefa.textContent = "X";

    list.appendChild(novaTarefa);
    novaTarefa.appendChild(btnTarefa);

    input.value = "";
    
    btnTarefa.addEventListener("click", function(){
        novaTarefa.parentNode.removeChild(novaTarefa);
    })
}
});


