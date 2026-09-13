/* =========================================================
   GEARNOVA - MAIN AUTH BRIDGE
========================================================= */


(async function () {


  /* =====================================================
     CHECK SUPABASE
  ===================================================== */

  if (!window.sb) {

    console.error(
      "Supabase client chưa được khởi tạo."
    );

    window.location.replace(
      "./login.html"
    );

    return;

  }


  /* =====================================================
     GET SESSION
  ===================================================== */

  try {


    const {
      data: { session },
      error
    } =
      await window.sb.auth.getSession();


    if (error) {

      console.error(
        "SESSION ERROR:",
        error
      );

      throw error;

    }


    /* ===================================================
       CHƯA LOGIN
    =================================================== */

    if (!session) {


      localStorage.removeItem(
        "gearnova_current_user"
      );


      window.location.replace(
        "./login.html"
      );


      return;

    }



    /* ===================================================
       USER
    =================================================== */

    const user =
      session.user;



    /* ===================================================
       DISPLAY NAME
    =================================================== */

    const displayName =

      user.user_metadata?.display_name ||

      user.user_metadata?.full_name ||

      user.user_metadata?.name ||

      user.email?.split("@")[0] ||

      "User";



    /* ===================================================
       BRIDGE CHO index.js CŨ
    =================================================== */

    localStorage.setItem(

      "gearnova_current_user",

      JSON.stringify({

        id:
          user.id,

        username:
          displayName,

        email:
          user.email

      })

    );



    /* ===================================================
       LOGOUT
    =================================================== */

    const logoutBtn =
      document.getElementById(
        "logoutBtn"
      );


    if (logoutBtn) {


      logoutBtn.addEventListener(

        "click",

        async function (event) {


          event.preventDefault();

          event.stopImmediatePropagation();


          try {


            const {
              error
            } =
              await window.sb.auth.signOut();


            if (error) {
              throw error;
            }


          }

          catch (error) {


            console.error(
              "LOGOUT ERROR:",
              error
            );


          }

          finally {


            localStorage.removeItem(
              "gearnova_current_user"
            );


            window.location.replace(
              "./login.html"
            );


          }


        },

        true

      );


    }



    /* ===================================================
       LOAD index.js
    =================================================== */

    const mainScript =
      document.createElement(
        "script"
      );


    mainScript.src =
      "./index.js?v=21";


    mainScript.defer =
      true;


    document.body.appendChild(
      mainScript
    );


  }

  catch (error) {


    console.error(
      "AUTH BRIDGE ERROR:",
      error
    );


    localStorage.removeItem(
      "gearnova_current_user"
    );


    window.location.replace(
      "./login.html"
    );


  }


})();