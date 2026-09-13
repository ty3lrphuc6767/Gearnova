/* =========================================================
   GEARNOVA - REGISTER
========================================================= */


document.addEventListener("DOMContentLoaded", function () {


  /* =====================================================
     ELEMENTS
  ===================================================== */

  const registerForm =
    document.getElementById("registerForm");

  const registerName =
    document.getElementById("registerName");

  const registerEmail =
    document.getElementById("registerEmail");

  const registerPassword =
    document.getElementById("registerPassword");

  const confirmPassword =
    document.getElementById("confirmPassword");

  const registerBtn =
    document.getElementById("registerBtn");

  const registerMessage =
    document.getElementById("registerMessage");

  const showPassword =
    document.getElementById("showPassword");

  const googleLoginBtn =
    document.getElementById("googleLoginBtn");


  /* =====================================================
     KIỂM TRA SUPABASE
  ===================================================== */

  if (!window.sb) {

    console.error(
      "window.sb chưa tồn tại. Kiểm tra supabase-client.js"
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

    if (!registerMessage) {
      return;
    }

    registerMessage.textContent = message;

    registerMessage.classList.remove(
      "success",
      "error"
    );

    if (type) {
      registerMessage.classList.add(type);
    }

  }


  /* =====================================================
     SHOW / HIDE PASSWORD
  ===================================================== */

  if (showPassword) {

    showPassword.addEventListener(
      "click",

      function () {


        const isPassword =
          registerPassword.type === "password";


        registerPassword.type =
          isPassword
            ? "text"
            : "password";


        confirmPassword.type =
          isPassword
            ? "text"
            : "password";


        showPassword.textContent =
          isPassword
            ? "Ẩn"
            : "Hiện";


      }
    );

  }


  /* =====================================================
     REGISTER
  ===================================================== */

  if (registerForm) {

    registerForm.addEventListener(
      "submit",

      async function (event) {

        event.preventDefault();


        /* -----------------------------------------------
           LẤY DATA
        ------------------------------------------------ */

        const name =
          registerName.value.trim();

        const email =
          registerEmail.value
            .trim()
            .toLowerCase();

        const password =
          registerPassword.value;

        const confirm =
          confirmPassword.value;


        /* -----------------------------------------------
           VALIDATE
        ------------------------------------------------ */

        if (!name) {

          showMessage(
            "Vui lòng nhập tên hiển thị.",
            "error"
          );

          return;

        }


        if (!email) {

          showMessage(
            "Vui lòng nhập email.",
            "error"
          );

          return;

        }


        if (password.length < 6) {

          showMessage(
            "Mật khẩu phải có ít nhất 6 ký tự.",
            "error"
          );

          return;

        }


        if (password !== confirm) {

          showMessage(
            "Hai mật khẩu không giống nhau.",
            "error"
          );

          return;

        }


        /* -----------------------------------------------
           LOADING
        ------------------------------------------------ */

        registerBtn.disabled = true;

        registerBtn.textContent =
          "ĐANG TẠO TÀI KHOẢN...";

        showMessage(
          "Đang tạo tài khoản..."
        );


        try {


          /* ---------------------------------------------
             SUPABASE SIGN UP
          ---------------------------------------------- */

          const {
            data,
            error
          } = await window.sb.auth.signUp({

            email: email,

            password: password,

            options: {

              data: {

                display_name: name

              }

            }

          });


          /* ---------------------------------------------
             ERROR
          ---------------------------------------------- */

          if (error) {

            console.error(
              "REGISTER ERROR:",
              error
            );

            throw error;

          }


          console.log(
            "REGISTER DATA:",
            data
          );


          /* ---------------------------------------------
             CÓ SESSION
             Email confirmation đang OFF
          ---------------------------------------------- */

          if (data.session) {

            showMessage(
              "Đăng ký thành công! Đang chuyển trang...",
              "success"
            );


            setTimeout(
              function () {

                window.location.replace(
                  "./index.html"
                );

              },
              700
            );


            return;

          }


          /* ---------------------------------------------
             KHÔNG CÓ SESSION
             Email confirmation đang ON
          ---------------------------------------------- */

          showMessage(
            "Đăng ký thành công. Hãy kiểm tra email để xác nhận tài khoản.",
            "success"
          );


          registerForm.reset();


        }

        catch (error) {


          console.error(error);


          let message =
            error?.message ||
            "Không thể đăng ký tài khoản.";


          /* Một số lỗi phổ biến */

          if (
            message
              .toLowerCase()
              .includes("already")
          ) {

            message =
              "Email này đã được đăng ký.";

          }


          showMessage(
            message,
            "error"
          );


        }

        finally {


          registerBtn.disabled = false;

          registerBtn.textContent =
            "TẠO TÀI KHOẢN";


        }


      }
    );

  }



  /* =====================================================
     GOOGLE LOGIN
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
          } = await window.sb.auth.signInWithOAuth({

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
            "GOOGLE LOGIN ERROR:",
            error
          );


          showMessage(
            error?.message ||
              "Không thể đăng nhập bằng Google.",
            "error"
          );


          googleLoginBtn.disabled = false;


        }


      }
    );

  }


});