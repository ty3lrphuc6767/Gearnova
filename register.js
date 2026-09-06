/* =========================================================
   GEARNOVA - REGISTER.JS
========================================================= */


/* =========================================================
   DOM
========================================================= */

const registerForm =
    document.getElementById(
        "registerForm"
    );

const usernameInput =
    document.getElementById(
        "registerUsername"
    );

const passwordInput =
    document.getElementById(
        "registerPassword"
    );

const confirmPasswordInput =
    document.getElementById(
        "confirmPassword"
    );

const showPasswordButton =
    document.getElementById(
        "showPassword"
    );

const registerMessage =
    document.getElementById(
        "registerMessage"
    );


/* =========================================================
   HIỆN / ẨN PASSWORD
========================================================= */

showPasswordButton.addEventListener(
    "click",
    function () {

        if (
            passwordInput.type ===
            "password"
        ) {

            passwordInput.type =
                "text";

            confirmPasswordInput.type =
                "text";

            showPasswordButton.textContent =
                "Ẩn";

        } else {

            passwordInput.type =
                "password";

            confirmPasswordInput.type =
                "password";

            showPasswordButton.textContent =
                "Hiện";

        }

    }
);


/* =========================================================
   REGISTER
========================================================= */

registerForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const username =
            usernameInput
                .value
                .trim();


        const password =
            passwordInput.value;


        const confirmPassword =
            confirmPasswordInput.value;


        /* =============================================
           USERNAME
        ============================================= */

        if (
            username.length < 3
        ) {

            showError(
                "Username phải có ít nhất 3 ký tự."
            );

            return;

        }


        /* =============================================
           PASSWORD
        ============================================= */

        if (
            password.length < 4
        ) {

            showError(
                "Password phải có ít nhất 4 ký tự."
            );

            return;

        }


        /* =============================================
           CONFIRM PASSWORD
        ============================================= */

        if (
            password !==
            confirmPassword
        ) {

            showError(
                "Hai mật khẩu không giống nhau."
            );

            return;

        }


        /* =============================================
           GET USERS
        ============================================= */

        let users = [];


        try {

            users =
                JSON.parse(
                    localStorage.getItem(
                        "gearnova_users"
                    )
                )
                ||
                [];

        } catch (error) {

            users =
                [];

        }


        /* =============================================
           CHECK USER EXISTS
        ============================================= */

        const exists =
            users.some(
                function (user) {

                    return (

                        user.username
                            .toLowerCase()

                        ===

                        username
                            .toLowerCase()

                    );

                }
            );


        if (exists) {

            showError(
                "Username này đã tồn tại."
            );

            return;

        }


        /* =============================================
           CREATE USER
        ============================================= */

        const newUser = {

            id:
                Date.now(),

            username:
                username,

            password:
                password

        };


        users.push(
            newUser
        );


        /* =============================================
           SAVE
        ============================================= */

        localStorage.setItem(
            "gearnova_users",

            JSON.stringify(
                users
            )
        );


        /* =============================================
           SUCCESS
        ============================================= */

        registerMessage.className =
            "message success";

        registerMessage.textContent =
            "Đăng ký thành công. Đang chuyển sang đăng nhập...";


        setTimeout(
            function () {

                window.location.href =
                    "./login.html";

            },
            700
        );

    }
);


/* =========================================================
   ERROR
========================================================= */

function showError(message) {

    registerMessage.className =
        "message error";

    registerMessage.textContent =
        message;

}