
```
GearNova
├─ auth.css
├─ bg-tech.png
├─ index.html
├─ index.js
├─ login.html
├─ login.js
├─ main-auth.js
├─ README.md
├─ register.html
├─ register.js
├─ styles.css
└─ supabase-client.js

```


<!doctype html>

<html lang="vi">
  <head>
    <meta charset="UTF-8" />

    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>Đăng nhập | GearNova</title>

    <link rel="preconnect" href="https://fonts.googleapis.com" />

    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
      rel="stylesheet"
    />

    <link rel="stylesheet" href="./auth.css?v=21" />
  </head>

  <body>
    <main class="auth-page">
      <!-- LEFT -->

      <section class="intro">
        <a href="./index.html" class="logo"> Gear<span>Nova</span> </a>

        <div class="intro-content">
          <p class="small-title">WELCOME BACK</p>

          <h1>
            CHÀO MỪNG TRỞ LẠI

            <br />

            <span> GEARNOVA </span>
          </h1>

          <p class="intro-text">
            Đăng nhập để tiếp tục khám phá linh kiện máy tính và Gaming Gear.
          </p>

          <div class="feature-list">
            <div class="feature">
              <i></i>

              <span> Linh kiện PC </span>
            </div>

            <div class="feature">
              <i></i>

              <span> Gaming Gear </span>
            </div>

            <div class="feature">
              <i></i>

              <span> Tài khoản cá nhân </span>
            </div>
          </div>
        </div>

        <p class="copyright">© 2026 GearNova</p>
      </section>

      <!-- RIGHT -->

      <section class="form-area">
        <div class="auth-box">
          <p class="form-tag">MEMBER LOGIN</p>

          <h2>Đăng nhập</h2>

          <p class="description">Đăng nhập vào GearNova.</p>

          <form id="loginForm">
            <!-- EMAIL -->

            <div class="input-group">
              <label for="loginEmail"> Email </label>

              <input
                type="email"
                id="loginEmail"
                placeholder="example@gmail.com"
                autocomplete="email"
                required
              />
            </div>

            <!-- PASSWORD -->

            <div class="input-group">
              <label for="loginPassword"> Password </label>

              <div class="password-box">
                <input
                  type="password"
                  id="loginPassword"
                  placeholder="Nhập mật khẩu"
                  autocomplete="current-password"
                  required
                />

                <button type="button" id="showPassword">Hiện</button>
              </div>
            </div>

            <p id="loginMessage" class="message"></p>

            <button type="submit" class="submit-btn" id="loginBtn">
              ĐĂNG NHẬP
            </button>
          </form>

          <div class="oauth-divider">
            <span> HOẶC </span>
          </div>

          <button type="button" class="google-btn" id="googleLoginBtn">
            <span class="google-icon"> G </span>

            <span> Tiếp tục bằng Google </span>
          </button>

          <p class="switch-page">
            Chưa có tài khoản?

            <a href="./register.html"> Đăng ký ngay </a>
          </p>
        </div>
      </section>
    </main>

    <!-- 1. SUPABASE -->

    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

    <!-- 2. CLIENT -->

    <script src="./supabase-client.js?v=21"></script>

    <!-- 3. LOGIN -->

    <script src="./login.js?v=21"></script>
  </body>
</html>



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


<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>GearNova | Trang chủ</title>

    <!-- FONT -->
    <link rel="preconnect" href="https://fonts.googleapis.com">

    <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossorigin
    >

    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
    >

    <!-- CSS TRANG MAIN -->
    <link
        rel="stylesheet"
        href="./styles.css"
    >
</head>


<body>


    <!-- ================================
         HEADER
    ================================= -->

    <header class="header">

        <div class="header-inner">

            <!-- LOGO -->
            <a
                href="index.html"
                class="logo"
            >
                Gear<span>Nova</span>
            </a>


            <!-- MENU -->
            <nav class="nav">

                <a
                    href="#home"
                    class="nav-link active"
                >
                    Trang chủ
                </a>

                <a
                    href="#products"
                    class="nav-link"
                >
                    Sản phẩm
                </a>

                <a
                    href="#categories"
                    class="nav-link"
                >
                    Danh mục
                </a>

                <a
                    href="#about"
                    class="nav-link"
                >
                    Giới thiệu
                </a>

            </nav>


            <!-- ACTION -->
            <div class="header-actions">

                <!-- SEARCH -->
                <button
                    type="button"
                    class="icon-btn"
                    id="openSearchBtn"
                    aria-label="Tìm kiếm"
                >
                    🔍
                </button>


                <!-- USER -->
                <div class="user-area">

                    <button
                        type="button"
                        class="user-btn"
                        id="userBtn"
                    >

                        <span class="user-dot"></span>

                        <span id="usernameDisplay">
                            Tài khoản
                        </span>

                    </button>


                    <div
                        class="user-menu"
                        id="userMenu"
                    >

                        <p class="user-menu-title">
                            TÀI KHOẢN
                        </p>

                        <p
                            class="user-menu-name"
                            id="menuUsername"
                        >
                            User
                        </p>

                        <button
                            type="button"
                            id="logoutBtn"
                        >
                            Đăng xuất
                        </button>

                    </div>

                </div>


                <!-- CART -->
                <button
                    type="button"
                    class="cart-btn"
                    id="cartBtn"
                >

                    <span>
                        Giỏ hàng
                    </span>

                    <span
                        class="cart-count"
                        id="cartCount"
                    >
                        0
                    </span>

                </button>

            </div>

        </div>

    </header>



    <!-- ================================
         SEARCH PANEL
    ================================= -->

    <div
        class="search-panel"
        id="searchPanel"
    >

        <div class="search-panel-inner">

            <input
                type="text"
                id="searchInput"
                placeholder="Tìm CPU, VGA, RAM, SSD, Gaming Gear..."
            >

            <button
                type="button"
                id="closeSearchBtn"
            >
                ×
            </button>

        </div>

    </div>



    <main>


        <!-- ================================
             HERO
        ================================= -->

        <section
            class="hero"
            id="home"
        >

            <div class="hero-overlay"></div>


            <div class="hero-content">

                <p class="hero-tag">
                    GEARNOVA TECHNOLOGY
                </p>


                <h1>
                    BUILD YOUR
                    <br>
                    <span>DREAM PC</span>
                </h1>


                <p class="hero-description">
                    Linh kiện máy tính và Gaming Gear
                    dành cho những cấu hình mạnh mẽ.
                    Nâng cấp hệ thống của bạn cùng GearNova.
                </p>


                <div class="hero-actions">

                    <a
                        href="#products"
                        class="primary-btn"
                    >
                        KHÁM PHÁ SẢN PHẨM
                    </a>


                    <a
                        href="#categories"
                        class="secondary-btn"
                    >
                        XEM DANH MỤC
                    </a>

                </div>


                <div class="hero-stats">

                    <div class="stat">

                        <strong>
                            100+
                        </strong>

                        <span>
                            Sản phẩm
                        </span>

                    </div>


                    <div class="stat">

                        <strong>
                            24/7
                        </strong>

                        <span>
                            Hỗ trợ
                        </span>

                    </div>


                    <div class="stat">

                        <strong>
                            100%
                        </strong>

                        <span>
                            Chính hãng
                        </span>

                    </div>

                </div>

            </div>

        </section>



        <!-- ================================
             DANH MỤC
        ================================= -->

        <section
            class="categories section"
            id="categories"
        >

            <div class="container">


                <div class="section-heading">

                    <div>

                        <p class="section-tag">
                            DANH MỤC
                        </p>

                        <h2>
                            Chọn thiết bị của bạn
                        </h2>

                    </div>

                </div>



                <div class="category-grid">


                    <button
                        type="button"
                        class="category-card active"
                        data-category="all"
                    >

                        <span class="category-icon">
                            ALL
                        </span>

                        <span>
                            Tất cả
                        </span>

                    </button>



                    <button
                        type="button"
                        class="category-card"
                        data-category="CPU"
                    >

                        <span class="category-icon">
                            CPU
                        </span>

                        <span>
                            Bộ vi xử lý
                        </span>

                    </button>



                    <button
                        type="button"
                        class="category-card"
                        data-category="VGA"
                    >

                        <span class="category-icon">
                            GPU
                        </span>

                        <span>
                            Card đồ họa
                        </span>

                    </button>



                    <button
                        type="button"
                        class="category-card"
                        data-category="RAM"
                    >

                        <span class="category-icon">
                            RAM
                        </span>

                        <span>
                            Bộ nhớ RAM
                        </span>

                    </button>



                    <button
                        type="button"
                        class="category-card"
                        data-category="SSD"
                    >

                        <span class="category-icon">
                            SSD
                        </span>

                        <span>
                            Ổ cứng SSD
                        </span>

                    </button>



                    <button
                        type="button"
                        class="category-card"
                        data-category="Gear"
                    >

                        <span class="category-icon">
                            GG
                        </span>

                        <span>
                            Gaming Gear
                        </span>

                    </button>


                </div>

            </div>

        </section>



        <!-- ================================
             SẢN PHẨM
        ================================= -->

        <section
            class="products section"
            id="products"
        >

            <div class="container">


                <div class="section-heading">

                    <div>

                        <p class="section-tag">
                            GEARNOVA STORE
                        </p>

                        <h2>
                            Sản phẩm nổi bật
                        </h2>

                    </div>


                    <p
                        class="product-result"
                        id="productResult"
                    >
                        Hiển thị tất cả sản phẩm
                    </p>

                </div>



                <!-- SẢN PHẨM DO index.js TẠO -->
                <div
                    class="product-grid"
                    id="productGrid"
                >
                </div>



                <!-- KHÔNG CÓ SẢN PHẨM -->
                <div
                    class="empty-products"
                    id="emptyProducts"
                >

                    <h3>
                        Không tìm thấy sản phẩm
                    </h3>

                    <p>
                        Hãy thử từ khóa hoặc danh mục khác.
                    </p>

                </div>

            </div>

        </section>



        <!-- ================================
             ABOUT
        ================================= -->

        <section
            class="about section"
            id="about"
        >

            <div class="container">


                <div class="about-box">


                    <div class="about-content">

                        <p class="section-tag">
                            ABOUT GEARNOVA
                        </p>

                        <h2>
                            Nâng cấp hiệu năng.
                            <br>
                            Làm chủ cuộc chơi.
                        </h2>

                        <p>
                            GearNova cung cấp linh kiện máy tính
                            và Gaming Gear dành cho game thủ,
                            sinh viên và những người yêu công nghệ.
                        </p>

                    </div>



                    <div class="about-features">


                        <div class="about-feature">

                            <span>
                                01
                            </span>

                            <div>

                                <h3>
                                    Sản phẩm chính hãng
                                </h3>

                                <p>
                                    Linh kiện đến từ những thương hiệu uy tín.
                                </p>

                            </div>

                        </div>



                        <div class="about-feature">

                            <span>
                                02
                            </span>

                            <div>

                                <h3>
                                    Cấu hình tối ưu
                                </h3>

                                <p>
                                    Dễ dàng lựa chọn linh kiện phù hợp nhu cầu.
                                </p>

                            </div>

                        </div>



                        <div class="about-feature">

                            <span>
                                03
                            </span>

                            <div>

                                <h3>
                                    Hỗ trợ nhanh
                                </h3>

                                <p>
                                    Hỗ trợ lựa chọn và nâng cấp máy tính.
                                </p>

                            </div>

                        </div>


                    </div>

                </div>

            </div>

        </section>

    </main>



    <!-- ================================
         PRODUCT MODAL
    ================================= -->

    <div
        class="modal"
        id="productModal"
    >

        <div
            class="modal-overlay"
            data-close-product
        >
        </div>


        <div class="product-modal-box">

            <button
                type="button"
                class="modal-close"
                id="closeProductModal"
            >
                ×
            </button>


            <div
                class="product-detail"
                id="productDetail"
            >
            </div>

        </div>

    </div>



    <!-- ================================
         CART OVERLAY
    ================================= -->

    <div
        class="cart-overlay"
        id="cartOverlay"
    >
    </div>



    <!-- ================================
         CART
    ================================= -->

    <aside
        class="cart-drawer"
        id="cartDrawer"
    >


        <div class="cart-header">

            <div>

                <p class="section-tag">
                    YOUR CART
                </p>

                <h2>
                    Giỏ hàng
                </h2>

            </div>


            <button
                type="button"
                class="cart-close"
                id="closeCartBtn"
            >
                ×
            </button>

        </div>



        <div
            class="cart-items"
            id="cartItems"
        >
        </div>



        <div
            class="cart-empty"
            id="cartEmpty"
        >

            <p>
                Giỏ hàng đang trống.
            </p>

        </div>



        <div class="cart-footer">

            <div class="cart-total">

                <span>
                    Tổng cộng
                </span>

                <strong id="cartTotal">
                    0 ₫
                </strong>

            </div>


            <button
                type="button"
                class="checkout-btn"
                id="checkoutBtn"
            >
                THANH TOÁN
            </button>

        </div>

    </aside>



    <!-- ================================
         TOAST
    ================================= -->

    <div
        class="toast"
        id="toast"
    >
    </div>



    <!-- ================================
         FOOTER
    ================================= -->

    <footer class="footer">

        <div class="container footer-inner">


            <div>

                <a
                    href="index.html"
                    class="logo footer-logo"
                >
                    Gear<span>Nova</span>
                </a>

                <p>
                    Linh kiện máy tính & Gaming Gear.
                </p>

            </div>


            <div class="footer-links">

                <a href="#home">
                    Trang chủ
                </a>

                <a href="#products">
                    Sản phẩm
                </a>

                <a href="#categories">
                    Danh mục
                </a>

                <a href="#about">
                    Giới thiệu
                </a>

            </div>


            <p class="copyright">
                © 2026 GearNova
            </p>

        </div>

    </footer>



    <!-- JS -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<script src="./supabase-client.js?v=21"></script>

<script src="./main-auth.js?v=21"></script>
    

</body>
</html>