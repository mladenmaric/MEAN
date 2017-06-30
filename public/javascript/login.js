function loginUser(e) {
    e.preventDefault();

    var user = {
        email: document.loginForm.inputEmail.value,
        password: document.loginForm.inputPassword.value
    };

    $.ajax({
        type: "POST",
        url: "/api/auth/login",
        dataType: "json",
        success: function(data) {
            if (data.success) {
                window.location = "tasks.html";
            } else {
                alert(data.msg);
            }
        },

        data: user
    });
}