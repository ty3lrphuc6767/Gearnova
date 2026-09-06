/* =========================================================
   GEARNOVA - LOGIN.JS
========================================================= */


/* =========================================================
   DOM
========================================================= */

const loginForm =
    document.getElementById("loginForm");

const usernameInput =
    document.getElementById("loginUsername");

const passwordInput =
    document.getElementById("loginPassword");

const showPasswordButton =
    document.getElementById("showPassword");

const loginMessage =
    document.getElementById("loginMessage");


/* =========================================================
   HIỆN / ẨN PASSWORD
========================================================= */

showPasswordButton.addEventListener(
    "click",
    function () {

        if (
            passwordInput.type === "password"
        ) {

            passwordInput.type =
                "text";

            showPasswordButton.textContent =
                "Ẩn";

        } else {

            passwordInput.type =
                "password";

            showPasswordButton.textContent =
                "Hiện";

        }

    }
);


/* =========================================================
   LOGIN
========================================================= */

loginForm.addEventListener(
    "submit",
    function (event) {

        /* KHÔNG CHO FORM RELOAD */
        event.preventDefault();


        const username =
            usernameInput
                .value
                .trim();


        const password =
            passwordInput.value;


        /* =============================================
           KIỂM TRA TRỐNG
        ============================================= */

        if (
            username === ""
            ||
            password === ""
        ) {

            showError(
                "Vui lòng nhập đầy đủ Username và Password."
            );

            return;

        }


        /* =============================================
           LẤY USER
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
           TÌM TÀI KHOẢN
        ============================================= */

        const user =
            users.find(
                function (item) {

                    return (

                        item.username
                            .toLowerCase()

                        ===

                        username
                            .toLowerCase()

                        &&

                        item.password
                        ===
                        password

                    );

                }
            );


        /* =============================================
           LOGIN SAI
        ============================================= */

        if (!user) {

            showError(
                "Username hoặc Password không đúng."
            );

            return;

        }


        /* =============================================
           LƯU SESSION
        ============================================= */

        localStorage.setItem(
            "gearnova_current_user",

            JSON.stringify({

                id:
                    user.id,

                username:
                    user.username

            })
        );


        /* =============================================
           THÔNG BÁO
        ============================================= */

        loginMessage.className =
            "message success";

        loginMessage.textContent =
            "Đăng nhập thành công...";


        /* =============================================
           CHUYỂN MAIN
        ============================================= */

        setTimeout(
            function () {

                window.location.href =
                    "./main.html";

            },
            400
        );

    }
);


/* =========================================================
   ERROR
========================================================= */

function showError(message) {

    loginMessage.className =
        "message error";

    loginMessage.textContent =
        message;

}