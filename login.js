/* =========================================================
   GEARNOVA - LOGIN
========================================================= */


document.addEventListener("DOMContentLoaded", function () {


  /* =====================================================
     ELEMENTS
  ===================================================== */

  const loginForm =
    document.getElementById("loginForm");

  const loginEmail =
    document.getElementById("loginEmail");

  const loginPassword =
    document.getElementById("loginPassword");

  const loginBtn =
    document.getElementById("loginBtn");

  const loginMessage =
    document.getElementById("loginMessage");

  const showPassword =
    document.getElementById("showPassword");

  const googleLoginBtn =
    document.getElementById("googleLoginBtn");


  /* =====================================================
     CHECK SUPABASE
  ===================================================== */

  if (!window.sb) {

    console.error(
      "window.sb chưa tồn tại."
    );

    showMessage(
      "Không kết nối được hệ thống đăng nhập.",
      "error"
    );

    return;

  }


  /* =====================================================
     MESSAGE
  ===================================================== */

  function showMessage(message, type = "") {

    if (!loginMessage) {
      return;
    }

    loginMessage.textContent =
      message;

    loginMessage.classList.remove(
      "success",
      "error"
    );

    if (type) {

      loginMessage.classList.add(
        type
      );

    }

  }


  /* =====================================================
     SHOW PASSWORD
  ===================================================== */

  if (showPassword) {

    showPassword.addEventListener(
      "click",

      function () {


        const hidden =
          loginPassword.type ===
          "password";


        loginPassword.type =
          hidden
            ? "text"
            : "password";


        showPassword.textContent =
          hidden
            ? "Ẩn"
            : "Hiện";


      }
    );

  }



  /* =====================================================
     NẾU ĐÃ LOGIN RỒI
  ===================================================== */

  async function checkExistingSession() {


    const {
      data: { session },
      error
    } = await window.sb.auth.getSession();


    if (error) {

      console.error(
        "GET SESSION:",
        error
      );

      return;

    }


    if (session) {

      window.location.replace(
        "./index.html"
      );

    }


  }


  checkExistingSession();



  /* =====================================================
     LOGIN EMAIL + PASSWORD
  ===================================================== */

  if (loginForm) {

    loginForm.addEventListener(
      "submit",

      async function (event) {

        event.preventDefault();


        const email =
          loginEmail.value
            .trim()
            .toLowerCase();

        const password =
          loginPassword.value;


        if (!email || !password) {

          showMessage(
            "Vui lòng nhập đầy đủ email và mật khẩu.",
            "error"
          );

          return;

        }


        loginBtn.disabled = true;

        loginBtn.textContent =
          "ĐANG ĐĂNG NHẬP...";


        showMessage(
          "Đang đăng nhập..."
        );


        try {


          const {
            data,
            error
          } =
            await window.sb.auth
              .signInWithPassword({

                email: email,

                password: password

              });


          if (error) {
            throw error;
          }


          if (!data.session) {

            throw new Error(
              "Không tạo được phiên đăng nhập."
            );

          }


          console.log(
            "LOGIN USER:",
            data.user
          );


          showMessage(
            "Đăng nhập thành công!",
            "success"
          );


          window.location.replace(
            "./index.html"
          );


        }

        catch (error) {


          console.error(
            "LOGIN ERROR:",
            error
          );


          let message =
            error?.message ||
            "Đăng nhập thất bại.";


          if (
            message
              .toLowerCase()
              .includes(
                "invalid login credentials"
              )
          ) {

            message =
              "Email hoặc mật khẩu không đúng.";

          }


          if (
            message
              .toLowerCase()
              .includes(
                "email not confirmed"
              )
          ) {

            message =
              "Email chưa được xác nhận.";

          }


          showMessage(
            message,
            "error"
          );


        }

        finally {


          loginBtn.disabled = false;

          loginBtn.textContent =
            "ĐĂNG NHẬP";


        }


      }
    );

  }



  /* =====================================================
     GOOGLE
  ===================================================== */

  if (googleLoginBtn) {

    googleLoginBtn.addEventListener(
      "click",

      async function () {


        googleLoginBtn.disabled = true;


        try {


          const redirectUrl =
            new URL(
              "./index.html",
              window.location.href
            ).href;


          const {
            error
          } =
            await window.sb.auth
              .signInWithOAuth({

                provider: "google",

                options: {

                  redirectTo:
                    redirectUrl

                }

              });


          if (error) {
            throw error;
          }


        }

        catch (error) {


          console.error(
            "GOOGLE ERROR:",
            error
          );


          showMessage(
            error?.message ||
              "Không thể đăng nhập bằng Google.",
            "error"
          );


          googleLoginBtn.disabled =
            false;


        }


      }
    );

  }


});