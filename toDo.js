/**
 * Created by Christopher on 9/14/2017.
 */

document.addEventListener('DOMContentLoaded', bindButtons);
/**
 * Allows user to add a task by pressing enter inside
 * the text input or by clicking the add button
 */
function bindButtons() {
    document.getElementById("addItemButton").addEventListener("click", function () {
        addItem(document.getElementById("addItemText").value);
        document.getElementById('addItemText').value = document.getElementById('addItemText').defaultValue;
        document.getElementById('addItemText').focus();
    });

    document.getElementById('addItemText').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            addItem(document.getElementById("addItemText").value);
            document.getElementById('addItemText').value = document.getElementById('addItemText').defaultValue;
        }
    });
}

/**
 * Creates a 'row' for the task being added to the list
 * Properly configures each element in the row then adds
 * the row to the data table. When adding a new row,
 * the adjustRow function is called to keep the list
 * sorted by priority.
 * @param item
 */
function addItem(item) {
    //get the data div
    var data = document.getElementById("data");

    //create a div for the new row of data
    var row = document.createElement("div");
    row.className = "row";

    //create a checkbox
    var box = document.createElement("input");
    box.type = "checkbox";
    box.className = "checkbox";

    //create text input for task
    var task = document.createElement("input");
    task.className = "task";
    task.type = "text";
    task.value = item;
    task.readOnly = true;

    //create priority select
    var priority = document.createElement("select");
    priority.className = "taskP";
    priority.disabled = true;
    priority.setAttribute("onchange", "setFocus(this)");

    //create add and select the correct priority
    var selInput = document.getElementById("priority");
    var selValue = selInput.options[selInput.selectedIndex].value;
    var selName = selInput.options[selInput.selectedIndex].text;
    var options = ["low", "med", "high"];
    for (var i = 0; i < 3; i++) {
        var option = document.createElement("option");
        option.text = options[i];
        option.value = i;
        priority.add(option);
        if (options[i] == selName)
            option.selected = true;
    }

    //create edit link
    var editLink = document.createElement('a');
    editLink.href = "#";
    editLink.innerHTML = "edit |";

    //create delete link
    var deleteLink = document.createElement('a');
    deleteLink.href = "#";
    deleteLink.innerHTML = "delete";

    //add elements to page
    row.appendChild(box);
    row.appendChild(task);
    row.appendChild(priority);
    row.appendChild(deleteLink);
    row.appendChild(editLink);

    //if it is the first row, simply add it to the list
    if (data.childElementCount == 0) {
        data.appendChild(row);
    }
    //else add by calling adjust to add to the correct position
    else {
        adjust(row);
    }

    //add functions to links
    editLink.onclick = function () {
        editTask(this.parentNode.firstChild.nextSibling)
    };
    deleteLink.onclick = function () {
        removeTask(this.parentNode)
    };

}

/**
 * The param 'task' is the text input for a particular task on the list
 * It allows the text input and the priority to be changed
 * Resorts the list if needed
 * Disables changes after 'enter' is pressed in the text input
 * @param task
 * @returns {boolean}
 */
function editTask(task) {
    var row = task.parentNode;
    var selInput = task.nextSibling;
    var selValue = selInput.options[selInput.selectedIndex].value;

    //make the text input and select box editable
    task.readOnly = false;
    selInput.disabled = false;

    //set focus on the text input
    task.focus();
    task.style.border = "1px solid";

    //allow edits to be made till user presses enter inside the text input
    task.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            //make the text input and select box un-editable
            task.readOnly = true;
            task.style.border = "none";
            task.nextSibling.disabled = true;

            //only call adjust row if priority has changed and there is more than one task in the list
            if (selValue != selInput.options[selInput.selectedIndex].value && row.parentNode.childElementCount != 1) {
                adjust(row);
            }
        }
    });
    return false;
}

/**
 * Removes the row from the list of tasks
 * @param row
 */
function removeTask(row) {
    var data = document.getElementById("data");
    data.removeChild(row);
}
/**
 * Will remove all rows that are checked 'completed'
 */
function removeCompleted() {
    var data = document.getElementById("data");
    var index = 0;

    while (index < data.childElementCount) {
        //if a row is removed, the next row now has that row's index
        if (data.childNodes[index].childNodes[0].checked == true) {
            removeTask(data.childNodes[index]);
        }
        else
            index++;
    }
    document.getElementById("clear").blur();
}

/**
 * Sorts the passed in row by priority
 * Will be added just after the last row with the
 * same priority
 * @param row
 */
function adjust(row) {
    //task list
    var data = document.getElementById("data");
    //holds a row element
    var curRow = data.firstElementChild;
    //holds that row's select element
    var curSel = curRow.childNodes[2];
    //get the value of the params priority
    var newValue = row.childNodes[2].options[row.childNodes[2].selectedIndex].value;

    //iterate through the list until you reach a row with a lower priority level
    while (curRow.childNodes[2].options[curRow.childNodes[2].selectedIndex].value >= newValue) {
        curRow = curRow.nextSibling;
        //if reached the end of the list, add item to last
        if (curRow == null)
            break;
    }
    //move the row just before the row with a lower priority level
    data.insertBefore(row, curRow);
}

/**
 * Function simply sets the focus on the text box after selecting
 * a priority. This allows the user to simply press enter to add
 * or submit an edit.
 * @param node
 */
function setFocus(node) {
    //set focus on the add item text input
    if (node == "add") {
        document.getElementById("addItemText").focus();
    }
    //set the focus on the text input of the row being edited
    else {
        node.previousElementSibling.focus();
    }
}
