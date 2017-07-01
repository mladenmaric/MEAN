function loginUser(e) {
    e.preventDefault();

    var user = {
        email: document.loginForm.inputEmail.value,
        password: document.loginForm.inputPassword.value
    };

    $.ajax({
        type: "POST",
        url: "/api/authenticate",
        dataType: "json",
        success: function(data) {
            if (data.success) {
                localStorage.setItem('token', data.token);
                window.location = "tasks.html";
            } else {
                alert(data.message);
            }
        },

        data: user
    });
}