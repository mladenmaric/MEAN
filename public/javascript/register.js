function registerUser(e) {
    e.preventDefault();

    var user = {
        firstName: document.registerForm.firstName.value,
        lastName: document.registerForm.lastName.value,
        email: document.registerForm.inputEmail.value,
        password: document.registerForm.inputPassword.value
    };

    $.ajax({
        type: "POST",
        url: "/api/register",
        dataType: "json",
        success: function(data) {
            console.log(data);
        },

        data: user
    });
}