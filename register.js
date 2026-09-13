/* =========================================================
   GEARNOVA - SUPABASE REGISTER
========================================================= */


const registerForm =
    document.getElementById(
        "registerForm"
    );


const nameInput =
    document.getElementById(
        "registerName"
    );


const emailInput =
    document.getElementById(
        "registerEmail"
    );


const passwordInput =
    document.getElementById(
        "registerPassword"
    );


const confirmPasswordInput =
    document.getElementById(
        "confirmPassword"
    );


const showPasswordBtn =
    document.getElementById(
        "showPassword"
    );


const registerMessage =
    document.getElementById(
        "registerMessage"
    );


const registerBtn =
    document.getElementById(
        "registerBtn"
    );


const googleLoginBtn =
    document.getElementById(
        "googleLoginBtn"
    );



/* =========================================================
   PASSWORD SHOW
========================================================= */

showPasswordBtn.addEventListener(
    "click",
    function () {

        const hidden =
            passwordInput.type ===
            "password";


        passwordInput.type =
            hidden
                ? "text"
                : "password";


        confirmPasswordInput.type =
            hidden
                ? "text"
                : "password";


        showPasswordBtn.textContent =
            hidden
                ? "Ẩn"
                : "Hiện";

    }
);



/* =========================================================
   REGISTER
========================================================= */

registerForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        clearMessage();


        const displayName =
            nameInput
                .value
                .trim();


        const email =
            emailInput
                .value
                .trim();


        const password =
            passwordInput.value;


        const confirmPassword =
            confirmPasswordInput.value;



        if (
            displayName.length < 2
        ) {

            showError(
                "Tên hiển thị phải có ít nhất 2 ký tự."
            );

            return;

        }



        if (
            password.length < 6
        ) {

            showError(
                "Password phải có ít nhất 6 ký tự."
            );

            return;

        }



        if (
            password !==
            confirmPassword
        ) {

            showError(
                "Hai mật khẩu không giống nhau."
            );

            return;

        }



        setLoading(
            true
        );



        const {
            data,
            error
        } =
            await window.sb.auth
                .signUp({

                    email:
                        email,

                    password:
                        password,

                    options: {

                        data: {

                            display_name:
                                displayName

                        }

                    }

                });



        if (error) {

            console.error(
                error
            );


            showError(
                translateRegisterError(
                    error.message
                )
            );


            setLoading(
                false
            );


            return;

        }



        /*
            Nếu Supabase tắt Confirm Email
            thì session có ngay.
        */

        if (
            data.session
        ) {

            showSuccess(
                "Đăng ký thành công..."
            );


            setTimeout(
                function () {

                    window.location.replace(
                        "./index.html"
                    );

                },
                500
            );


            return;

        }



        /*
            Nếu Confirm Email đang bật,
            Supabase sẽ tạo user nhưng chưa login.
        */

        showSuccess(
            "Đăng ký thành công. Hãy kiểm tra email để xác nhận tài khoản."
        );


        setLoading(
            false
        );

    }
);



/* =========================================================
   GOOGLE
========================================================= */

googleLoginBtn.addEventListener(
    "click",
    async function () {

        clearMessage();


        const redirectUrl =
            window.location.origin
            +
            "./index.html";


        googleLoginBtn.disabled =
            true;


        googleLoginBtn.textContent =
            "Đang kết nối Google...";



        const {
            error
        } =
            await window.sb.auth
                .signInWithOAuth({

                    provider:
                        "google",

                    options: {

                        redirectTo:
                            redirectUrl

                    }

                });



        if (error) {

            console.error(
                error
            );


            showError(
                "Không thể kết nối Google: "
                +
                error.message
            );


            googleLoginBtn.disabled =
                false;


            googleLoginBtn.innerHTML = `

                <span class="google-icon">
                    G
                </span>

                <span>
                    Tiếp tục bằng Google
                </span>

            `;

        }

    }
);



/* =========================================================
   LOADING
========================================================= */

function setLoading(
    loading
) {

    registerBtn.disabled =
        loading;


    registerBtn.textContent =
        loading
            ? "ĐANG TẠO..."
            : "TẠO TÀI KHOẢN";

}



/* =========================================================
   MESSAGE
========================================================= */

function clearMessage() {

    registerMessage.className =
        "message";


    registerMessage.textContent =
        "";

}


function showError(
    message
) {

    registerMessage.className =
        "message error";


    registerMessage.textContent =
        message;

}


function showSuccess(
    message
) {

    registerMessage.className =
        "message success";


    registerMessage.textContent =
        message;

}



/* =========================================================
   ERROR
========================================================= */

function translateRegisterError(
    message
) {

    const text =
        message.toLowerCase();


    if (
        text.includes(
            "already registered"
        )
    ) {

        return "Email này đã được đăng ký.";

    }


    if (
        text.includes(
            "password"
        )
        &&
        text.includes(
            "characters"
        )
    ) {

        return "Mật khẩu chưa đủ mạnh.";

    }


    return message;

}