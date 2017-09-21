/**
 * Created by Christopher on 9/19/2017.
 * Alters the simple to-do list app to
 * take advantage of the jQuery library
 */

/**
 * Adds event handlers to add tasks if user presses enter in
 * the text box or clicks the add button
 * Also allows user to remove all completed tasks by clicking
 * the clear button
 */
$("document").ready(function () {
    $("#addItemText").keypress(function(event){
        if(event.which == 13){
            addItem();
        }
    })
   $("#addItemButton").on("click", addItem);
   $("#clear").on("click", removeAll);

})

/**
 * Creates a 'row' for the task being added to the list
 * Properly configures each element in the row then adds
 * the row to the data table. When adding a new row,
 * the sortRow function is called to keep the list
 * sorted by priority.
 */
function addItem(){
    //create a row and all it's variables
    var $row = $("<div></div>").appendTo($("#data"));
    var $box = $("<input type='checkbox'>").appendTo($row);
    var $task = $("<input class='task' type='text' readonly style='border: transparent'> </input>").appendTo($row);
    var $priority = $("#priority").filter(':last').clone().appendTo($row).prop("disabled", true).addClass("taskP");
    var $delete = $("<a href='#'>delete</a>").appendTo($row).click(function(){deleteRow($(this).parent())});
    var $edit = $("<a href='#'>edit |</a>").appendTo($row).click(function(){editRow($(this).parent())});

    $task.val($("#addItemText").val());
    $priority.find("option[value = '" + $("#priority option:selected").val() + "']").prop("selected", true);

    sortRow($row);

    $("#addItemText").val("").focus();
}

/**
* Removes the row from the list of tasks
* @param row
*/
function deleteRow(row){
    row.remove();
}

/**
 * Will remove all rows that are checked 'completed'
 */
function removeAll(){
    $(":checkbox:checked").each(function(){
        deleteRow($(this).parent());
    });
}

/**
 * Takes a row div as a param
 * It allows the text input and the priority to be changed
 * Resorts the list if needed
 * Disables changes after 'enter' is pressed in the text input
 * @param row
 */
function editRow(row){
    var $newPri = row.children().eq(2).val();
    row.children().eq(2).prop("disabled", false);
    row.children().eq(1).prop("readonly", false).css({"color":"red", "background":"yellow"}).focus().keypress(function(event){
        if(event.which == 13){
            row.children().eq(2).prop("disabled", true);
            row.children().eq(1).prop("readonly", true).css({"color":"black", "background":"none"});
            $("#addItemText").focus();
            if($newPri != row.children().eq(2).val()){
                sortRow(row);
            }
        }
    });
}

/**
 * Sorts the passed in row by priority
 * Will be added just after the last row with the
 * same priority
 * @param row
 */
function sortRow(row){
    $("#data").children().each(function(){
        console.log($(this).children().eq(2).val() );
        console.log(row.children().eq(2).val());


        if ($(this).children().eq(2).val() < row.children().eq(2).val()){
            $(this).before(row);
            console.log("test");
            return false;
        }
        row.appendTo($("#data"));
    })
}

