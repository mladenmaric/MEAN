var user = null;
var tasks = null;

function logout() {
    localStorage.removeItem("token");
    window.location = 'index.html';
}

function load() {
    if (localStorage.getItem("token")) {
        $.ajax({
            type: "GET",
            url: "/api/user",
            dataType: "json",
            headers: { "x-access-token": localStorage.getItem("token") },
            success: function(data) {
                if (data.success) {
                    user = data.user;
                    fillData();
                } else {
                    window.location = 'login.html';
                }
            }
        });
        $.ajax({
            type: "GET",
            url: "/api/tasks",
            dataType: "json",
            headers: { "x-access-token": localStorage.getItem("token") },
            success: function(data) {
                if (data.success) {
                    tasks = data.tasks;
                    fillTasks();
                } else {
                    alert(data.message);
                }
            }
        });
    } else {
        window.location = 'login.html';
    }
}

function fillData() {
    document.getElementById('title').innerHTML = "Welcome, " + user.firstName + " " + user.lastName;
}

function fillTasks() {
    var table = document.getElementById('tableTasks');
    table.innerHTML = `<tr>
		<th>#</th>
		<th>Name</th>
		<th>Description</th>
		<th>Done</th>
	</tr>`;
    console.log(tasks);
    for (var i = 0; i < tasks.length; i++) {
        var tableRow = `<tr>
			<td>` + (i + 1) + `</td>
			<td>` + tasks[i].name + `</td>
			<td>` + tasks[i].description + `</td>
			<td><input onclick='taskDone(this.checked, ` + i + `)' type='checkbox' ` + (tasks[i].done == true ? "checked" : "") + ` /></td>
		</tr>`;

        table.innerHTML += tableRow;
    }

}

function addTask(e) {
    e.preventDefault();

    var task = {
        name: document.addTaskForm.name.value,
        description: document.addTaskForm.description.value,
        done: document.addTaskForm.done.checked
    };

    document.addTaskForm.name.value = "";
    document.addTaskForm.description.value = "";
    document.addTaskForm.done.checked = false;

    $.ajax({
        type: "POST",
        url: "/api/task/add",
        dataType: "json",
        headers: { "x-access-token": localStorage.getItem("token") },
        success: function(data) {
            if (data.success) {
                tasks.push(data.task);
                fillTasks();
            } else {
                alert(data.message);
            }
        },
        data: task
    });
}

function taskDone(done, index) {
    var task = {
        done: done
    };
    tasks[index].done = done;

    $.ajax({
        type: "PUT",
        url: "/api/task/" + tasks[index]._id,
        dataType: "json",
        headers: { "x-access-token": localStorage.getItem("token") },
        data: task
    });
}