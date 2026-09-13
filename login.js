/* =========================================================
   GEARNOVA - SUPABASE LOGIN
========================================================= */


const loginForm =
    document.getElementById(
        "loginForm"
    );


const emailInput =
    document.getElementById(
        "loginEmail"
    );


const passwordInput =
    document.getElementById(
        "loginPassword"
    );


const showPasswordBtn =
    document.getElementById(
        "showPassword"
    );


const loginMessage =
    document.getElementById(
        "loginMessage"
    );


const loginBtn =
    document.getElementById(
        "loginBtn"
    );


const googleLoginBtn =
    document.getElementById(
        "googleLoginBtn"
    );



/* =========================================================
   NẾU ĐÃ ĐĂNG NHẬP → MAIN
========================================================= */

async function checkCurrentSession() {

    const {
        data: {
            session
        }
    } =
        await window.sb.auth.getSession();


    if (session) {

        window.location.replace(
            "./index.html"
        );

    }

}


checkCurrentSession();



/* =========================================================
   SHOW PASSWORD
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


        showPasswordBtn.textContent =
            hidden
                ? "Ẩn"
                : "Hiện";

    }
);



/* =========================================================
   LOGIN EMAIL + PASSWORD
========================================================= */

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        clearMessage();


        const email =
            emailInput
                .value
                .trim();


        const password =
            passwordInput.value;



        if (
            !email
            ||
            !password
        ) {

            showError(
                "Vui lòng nhập Email và Password."
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
                .signInWithPassword({

                    email:
                        email,

                    password:
                        password

                });



        if (error) {

            console.error(
                error
            );


            showError(
                translateLoginError(
                    error.message
                )
            );


            setLoading(
                false
            );


            return;

        }



        if (
            !data.session
        ) {

            showError(
                "Không thể tạo phiên đăng nhập."
            );


            setLoading(
                false
            );


            return;

        }



        showSuccess(
            "Đăng nhập thành công..."
        );



        setTimeout(
            function () {

                window.location.replace(
                    "./index.html"
                );

            },
            350
        );

    }
);



/* =========================================================
   GOOGLE LOGIN
========================================================= */

googleLoginBtn.addEventListener(
    "click",
    async function () {

        clearMessage();


        googleLoginBtn.disabled =
            true;


        googleLoginBtn.innerHTML =
            "Đang kết nối Google...";



        const redirectUrl =
            window.location.origin
            +
            "./index.html";



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
                "Không thể đăng nhập bằng Google: "
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
                    Đăng nhập bằng Google
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

    loginBtn.disabled =
        loading;


    loginBtn.textContent =
        loading
            ? "ĐANG ĐĂNG NHẬP..."
            : "ĐĂNG NHẬP";

}



/* =========================================================
   MESSAGE
========================================================= */

function clearMessage() {

    loginMessage.className =
        "message";


    loginMessage.textContent =
        "";

}


function showError(
    message
) {

    loginMessage.className =
        "message error";


    loginMessage.textContent =
        message;

}


function showSuccess(
    message
) {

    loginMessage.className =
        "message success";


    loginMessage.textContent =
        message;

}



/* =========================================================
   TRANSLATE ERROR
========================================================= */

function translateLoginError(
    message
) {

    const text =
        message.toLowerCase();


    if (
        text.includes(
            "invalid login credentials"
        )
    ) {

        return "Email hoặc mật khẩu không đúng.";

    }


    if (
        text.includes(
            "email not confirmed"
        )
    ) {

        return "Email chưa được xác nhận. Hãy kiểm tra hộp thư.";

    }


    return message;

}