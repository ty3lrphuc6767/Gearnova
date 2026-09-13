/* =========================================================
   GEARNOVA - MAIN AUTH BRIDGE
========================================================= */


(async function () {


    /* =====================================================
       GET SESSION
    ===================================================== */

    const {
        data: {
            session
        },
        error
    } =
        await window.sb.auth
            .getSession();



    if (
        error
        ||
        !session
    ) {

        localStorage.removeItem(
            "gearnova_current_user"
        );


        window.location.replace(
            "./login.html"
        );


        return;

    }



    const user =
        session.user;



    /* =====================================================
       DISPLAY NAME
    ===================================================== */

    const displayName =

        user.user_metadata
            ?.display_name

        ||

        user.user_metadata
            ?.full_name

        ||

        user.user_metadata
            ?.name

        ||

        user.email
            ?.split("@")[0]

        ||

        "User";



    /* =====================================================
       BRIDGE CHO index.JS CŨ

       index.js hiện tại đang đọc:
       gearnova_current_user

       Ta tạo nó từ Supabase để không phải sửa
       nguyên index.js cũ.
    ===================================================== */

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



    /* =====================================================
       BẮT NÚT LOGOUT
    ===================================================== */

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    if (logoutBtn) {

        logoutBtn.addEventListener(

            "click",

            async function (
                event
            ) {

                /*
                    chặn logout cũ trong index.js
                */

                event.preventDefault();

                event.stopImmediatePropagation();



                await window.sb.auth
                    .signOut();



                localStorage.removeItem(
                    "gearnova_current_user"
                );



                window.location.replace(
                    "./login.html"
                );

            },

            true
        );

    }



    /* =====================================================
       LOAD index SAU KHI AUTH XONG
    ===================================================== */

    const mainScript =
        document.createElement(
            "script"
        );


    mainScript.src =
        "./index.js?v=20";


    document.body.appendChild(
        mainScript
    );


})();