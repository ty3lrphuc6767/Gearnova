/* =========================================================
   GEARNOVA - MAIN.JS
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       1. KIỂM TRA ĐĂNG NHẬP
    ===================================================== */

    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "gearnova_current_user"
            )
        );


    if (!currentUser) {

        window.location.replace(
            "login.html"
        );

        return;
    }



    /* =====================================================
       2. DOM
    ===================================================== */

    const usernameDisplay =
        document.getElementById(
            "usernameDisplay"
        );

    const menuUsername =
        document.getElementById(
            "menuUsername"
        );

    const userBtn =
        document.getElementById(
            "userBtn"
        );

    const userMenu =
        document.getElementById(
            "userMenu"
        );

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    const openSearchBtn =
        document.getElementById(
            "openSearchBtn"
        );

    const searchPanel =
        document.getElementById(
            "searchPanel"
        );

    const searchInput =
        document.getElementById(
            "searchInput"
        );

    const closeSearchBtn =
        document.getElementById(
            "closeSearchBtn"
        );


    const navLinks =
        document.querySelectorAll(
            ".nav-link"
        );


    const categoryCards =
        document.querySelectorAll(
            ".category-card"
        );


    const productGrid =
        document.getElementById(
            "productGrid"
        );

    const productResult =
        document.getElementById(
            "productResult"
        );

    const emptyProducts =
        document.getElementById(
            "emptyProducts"
        );


    const productModal =
        document.getElementById(
            "productModal"
        );

    const productDetail =
        document.getElementById(
            "productDetail"
        );

    const closeProductModal =
        document.getElementById(
            "closeProductModal"
        );


    const cartBtn =
        document.getElementById(
            "cartBtn"
        );

    const cartCount =
        document.getElementById(
            "cartCount"
        );

    const cartOverlay =
        document.getElementById(
            "cartOverlay"
        );

    const cartDrawer =
        document.getElementById(
            "cartDrawer"
        );

    const closeCartBtn =
        document.getElementById(
            "closeCartBtn"
        );

    const cartItems =
        document.getElementById(
            "cartItems"
        );

    const cartEmpty =
        document.getElementById(
            "cartEmpty"
        );

    const cartTotal =
        document.getElementById(
            "cartTotal"
        );

    const checkoutBtn =
        document.getElementById(
            "checkoutBtn"
        );


    const toast =
        document.getElementById(
            "toast"
        );



    /* =====================================================
       3. USER
    ===================================================== */

    usernameDisplay.textContent =
        currentUser.username;

    menuUsername.textContent =
        currentUser.username;



    /* =====================================================
       4. TẠO ẢNH SẢN PHẨM DEMO
       Không cần tải ảnh mạng
    ===================================================== */

    function createProductImage(
        title,
        subtitle
    ) {

        const svg = `
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="800"
            height="500"
            viewBox="0 0 800 500"
        >

            <rect
                width="800"
                height="500"
                fill="#0c0c0c"
            />

            <path
                d="
                    M0 90
                    H170
                    L220 140
                    H430
                    L500 70
                    H800

                    M0 270
                    H130
                    L190 330
                    H400
                    L470 260
                    H800

                    M100 0
                    V100
                    L150 150
                    V500

                    M650 0
                    V120
                    L600 170
                    V500
                "
                fill="none"
                stroke="#e50914"
                stroke-width="2"
                opacity="0.35"
            />

            <circle
                cx="170"
                cy="90"
                r="5"
                fill="#e50914"
            />

            <circle
                cx="470"
                cy="260"
                r="5"
                fill="#e50914"
            />

            <text
                x="50%"
                y="46%"
                text-anchor="middle"
                fill="#ffffff"
                font-size="58"
                font-family="Arial"
                font-weight="700"
            >
                ${title}
            </text>

            <text
                x="50%"
                y="58%"
                text-anchor="middle"
                fill="#e50914"
                font-size="23"
                font-family="Arial"
                font-weight="600"
                letter-spacing="3"
            >
                ${subtitle}
            </text>

        </svg>
        `;


        return (
            "data:image/svg+xml;charset=UTF-8,"
            +
            encodeURIComponent(svg)
        );
    }



    /* =====================================================
       5. DỮ LIỆU SẢN PHẨM
    ===================================================== */

    const products = [

        {
            id: 1,

            name:
                "ASUS Dual GeForce RTX 4060 OC 8GB",

            category:
                "VGA",

            price:
                8290000,

            image:
                createProductImage(
                    "RTX 4060",
                    "GEFORCE"
                ),

            description:
                "Card đồ họa RTX 4060 dành cho gaming Full HD, hỗ trợ Ray Tracing và DLSS.",

            specs: [
                "VRAM: 8GB GDDR6",
                "Kiến trúc: NVIDIA Ada Lovelace",
                "Hỗ trợ Ray Tracing",
                "Hỗ trợ DLSS"
            ]
        },


        {
            id: 2,

            name:
                "AMD Ryzen 5 7600",

            category:
                "CPU",

            price:
                4890000,

            image:
                createProductImage(
                    "RYZEN 5",
                    "7600"
                ),

            description:
                "CPU AMD Ryzen thế hệ mới phù hợp cho gaming và làm việc đa nhiệm.",

            specs: [
                "6 nhân / 12 luồng",
                "Socket AM5",
                "Kiến trúc Zen 4",
                "TDP 65W"
            ]
        },


        {
            id: 3,

            name:
                "Intel Core i5-14400F",

            category:
                "CPU",

            price:
                5290000,

            image:
                createProductImage(
                    "CORE i5",
                    "14400F"
                ),

            description:
                "Bộ vi xử lý Intel Core i5 phù hợp cho PC gaming và workstation phổ thông.",

            specs: [
                "10 nhân",
                "16 luồng",
                "Socket LGA1700",
                "Không tích hợp GPU"
            ]
        },


        {
            id: 4,

            name:
                "Kingston Fury Beast 16GB DDR5",

            category:
                "RAM",

            price:
                1390000,

            image:
                createProductImage(
                    "FURY",
                    "16GB DDR5"
                ),

            description:
                "RAM DDR5 hiệu năng cao dành cho hệ thống gaming thế hệ mới.",

            specs: [
                "Dung lượng: 16GB",
                "Chuẩn DDR5",
                "Tản nhiệt kim loại",
                "Tối ưu cho gaming"
            ]
        },


        {
            id: 5,

            name:
                "Samsung 990 EVO 1TB NVMe",

            category:
                "SSD",

            price:
                2490000,

            image:
                createProductImage(
                    "990 EVO",
                    "1TB NVME"
                ),

            description:
                "SSD NVMe tốc độ cao giúp khởi động Windows và game nhanh hơn.",

            specs: [
                "Dung lượng: 1TB",
                "Chuẩn M.2 NVMe",
                "PCIe",
                "Tốc độ đọc ghi cao"
            ]
        },


        {
            id: 6,

            name:
                "Keychron K2 Pro Mechanical Keyboard",

            category:
                "Gear",

            price:
                2390000,

            image:
                createProductImage(
                    "K2 PRO",
                    "KEYCHRON"
                ),

            description:
                "Bàn phím cơ không dây nhỏ gọn dành cho gaming và làm việc.",

            specs: [
                "Layout 75%",
                "Mechanical Keyboard",
                "Bluetooth",
                "USB-C"
            ]
        },


        {
            id: 7,

            name:
                "Logitech G502 X Gaming Mouse",

            category:
                "Gear",

            price:
                1890000,

            image:
                createProductImage(
                    "G502 X",
                    "LOGITECH"
                ),

            description:
                "Chuột gaming Logitech với cảm biến chính xác và thiết kế công thái học.",

            specs: [
                "Cảm biến gaming",
                "Nút có thể lập trình",
                "Thiết kế công thái học",
                "Kết nối USB"
            ]
        },


        {
            id: 8,

            name:
                "HyperX Cloud III Gaming Headset",

            category:
                "Gear",

            price:
                1990000,

            image:
                createProductImage(
                    "CLOUD III",
                    "HYPERX"
                ),

            description:
                "Tai nghe gaming với âm thanh rõ, microphone và thiết kế thoải mái.",

            specs: [
                "Gaming Headset",
                "Microphone",
                "Âm thanh chất lượng cao",
                "Đệm tai mềm"
            ]
        }

    ];



    /* =====================================================
       6. FORMAT TIỀN
    ===================================================== */

    function formatMoney(value) {

        return new Intl.NumberFormat(
            "vi-VN",
            {
                style:
                    "currency",

                currency:
                    "VND"
            }
        ).format(value);

    }



    /* =====================================================
       7. NORMALIZE TEXT
    ===================================================== */

    function normalizeText(text) {

        return String(text)
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            );

    }



    /* =====================================================
       8. TRẠNG THÁI FILTER
    ===================================================== */

    let selectedCategory =
        "all";

    let searchKeyword =
        "";



    const categoryNames = {

        all:
            "Tất cả",

        CPU:
            "CPU",

        VGA:
            "GPU / VGA",

        RAM:
            "RAM",

        SSD:
            "SSD",

        Gear:
            "Gaming Gear"

    };



    /* =====================================================
       9. RENDER PRODUCTS
    ===================================================== */

    function renderProducts() {

        const keyword =
            normalizeText(
                searchKeyword
            );


        const filteredProducts =
            products.filter(
                function (product) {

                    const categoryMatch =
                        selectedCategory === "all"
                        ||
                        product.category ===
                        selectedCategory;


                    const searchableText =
                        normalizeText(
                            product.name
                            +
                            " "
                            +
                            product.category
                            +
                            " "
                            +
                            product.description
                        );


                    const searchMatch =
                        searchableText.includes(
                            keyword
                        );


                    return (
                        categoryMatch
                        &&
                        searchMatch
                    );

                }
            );


        productGrid.innerHTML =
            "";


        if (
            filteredProducts.length === 0
        ) {

            emptyProducts.classList.add(
                "show"
            );

        } else {

            emptyProducts.classList.remove(
                "show"
            );

        }


        filteredProducts.forEach(
            function (product) {

                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "product-card";


                card.innerHTML = `

                    <div class="product-image">

                        <img
                            src="${product.image}"
                            alt="${product.name}"
                        >

                    </div>


                    <div class="product-info">

                        <p class="product-category">
                            ${product.category}
                        </p>


                        <h3 class="product-name">
                            ${product.name}
                        </h3>


                        <p class="product-price">
                            ${formatMoney(product.price)}
                        </p>


                        <div class="product-actions">

                            <button
                                type="button"
                                class="detail-btn"
                                data-detail-id="${product.id}"
                            >
                                CHI TIẾT
                            </button>


                            <button
                                type="button"
                                class="add-cart-btn"
                                data-cart-id="${product.id}"
                            >
                                THÊM GIỎ
                            </button>

                        </div>

                    </div>
                `;


                productGrid.appendChild(
                    card
                );

            }
        );


        updateProductResult(
            filteredProducts.length
        );

    }



    /* =====================================================
       10. TEXT KẾT QUẢ
    ===================================================== */

    function updateProductResult(count) {

        if (
            selectedCategory === "all"
            &&
            searchKeyword === ""
        ) {

            productResult.textContent =
                "Hiển thị "
                +
                count
                +
                " sản phẩm";

            return;
        }


        if (
            searchKeyword !== ""
        ) {

            productResult.textContent =
                count
                +
                ' kết quả cho "'
                +
                searchKeyword
                +
                '"';

            return;
        }


        productResult.textContent =
            categoryNames[
                selectedCategory
            ]
            +
            " • "
            +
            count
            +
            " sản phẩm";

    }



    /* =====================================================
       11. CATEGORY ACTIVE + FILTER
    ===================================================== */

    categoryCards.forEach(
        function (card) {

            card.addEventListener(
                "click",
                function () {

                    categoryCards.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    this.classList.add(
                        "active"
                    );


                    selectedCategory =
                        this.dataset.category;


                    renderProducts();


                    document
                        .getElementById(
                            "products"
                        )
                        .scrollIntoView({
                            behavior:
                                "smooth"
                        });

                }
            );

        }
    );



    /* =====================================================
       12. SEARCH
    ===================================================== */

    openSearchBtn.addEventListener(
        "click",
        function () {

            searchPanel.classList.add(
                "show"
            );


            setTimeout(
                function () {

                    searchInput.focus();

                },
                100
            );

        }
    );


    closeSearchBtn.addEventListener(
        "click",
        function () {

            searchPanel.classList.remove(
                "show"
            );

        }
    );


    searchInput.addEventListener(
        "input",
        function () {

            searchKeyword =
                this.value.trim();


            renderProducts();

        }
    );



    /* =====================================================
       13. MENU HEADER ACTIVE
    ===================================================== */

    navLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    navLinks.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    this.classList.add(
                        "active"
                    );

                }
            );

        }
    );



    /* =====================================================
       14. ACTIVE MENU THEO SCROLL
    ===================================================== */

    const sections = [

        document.getElementById(
            "home"
        ),

        document.getElementById(
            "products"
        ),

        document.getElementById(
            "categories"
        ),

        document.getElementById(
            "about"
        )

    ].filter(Boolean);



    function updateActiveNavigation() {

        let currentSection =
            "home";


        sections.forEach(
            function (section) {

                const top =
                    section.offsetTop
                    -
                    180;


                if (
                    window.scrollY >= top
                ) {

                    currentSection =
                        section.id;

                }

            }
        );


        navLinks.forEach(
            function (link) {

                link.classList.remove(
                    "active"
                );


                if (
                    link.getAttribute(
                        "href"
                    )
                    ===
                    "#"
                    +
                    currentSection
                ) {

                    link.classList.add(
                        "active"
                    );

                }

            }
        );

    }


    window.addEventListener(
        "scroll",
        updateActiveNavigation
    );



    /* =====================================================
       15. USER MENU
    ===================================================== */

    userBtn.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();


            userMenu.classList.toggle(
                "show"
            );

        }
    );


    document.addEventListener(
        "click",
        function (event) {

            if (
                !userMenu.contains(
                    event.target
                )
                &&
                !userBtn.contains(
                    event.target
                )
            ) {

                userMenu.classList.remove(
                    "show"
                );

            }

        }
    );



    /* =====================================================
       16. LOGOUT
    ===================================================== */

    /* =========================================================
   LOGOUT
========================================================= */

logoutBtn.addEventListener(
    "click",
    function () {

        localStorage.removeItem(
            "gearnova_current_user"
        );

        /*
            replace để không quay ngược
            lại main bằng nút Back
        */

        window.location.replace(
            "./login.html"
        );

    }
);


    /* =====================================================
       17. PRODUCT DETAIL
    ===================================================== */

    function openProductDetail(
        productId
    ) {

        const product =
            products.find(
                function (item) {

                    return (
                        item.id ===
                        productId
                    );

                }
            );


        if (!product) {
            return;
        }


        productDetail.innerHTML = `

            <div
                style="
                    display:grid;
                    grid-template-columns:
                        minmax(260px, 1fr)
                        minmax(280px, 1fr);
                    gap:35px;
                    align-items:center;
                "
            >

                <div>

                    <img
                        src="${product.image}"
                        alt="${product.name}"

                        style="
                            width:100%;
                            display:block;
                            border-radius:9px;
                            border:1px solid #292929;
                        "
                    >

                </div>


                <div>

                    <p
                        style="
                            color:#e50914;
                            font-size:11px;
                            letter-spacing:2px;
                            font-weight:600;
                        "
                    >
                        ${product.category}
                    </p>


                    <h2
                        style="
                            margin:10px 0 15px;
                            font-size:30px;
                            line-height:1.2;
                        "
                    >
                        ${product.name}
                    </h2>


                    <p
                        style="
                            color:#999;
                            line-height:1.7;
                        "
                    >
                        ${product.description}
                    </p>


                    <ul
                        style="
                            color:#bbb;
                            line-height:1.9;
                            padding-left:20px;
                        "
                    >

                        ${
                            product.specs
                                .map(
                                    function (
                                        spec
                                    ) {

                                        return (
                                            "<li>"
                                            +
                                            spec
                                            +
                                            "</li>"
                                        );

                                    }
                                )
                                .join("")
                        }

                    </ul>


                    <p
                        style="
                            margin:22px 0;
                            font-size:24px;
                            font-weight:600;
                            color:white;
                        "
                    >
                        ${formatMoney(product.price)}
                    </p>


                    <button
                        type="button"
                        data-modal-cart="${product.id}"

                        style="
                            width:100%;
                            height:48px;
                            background:#e50914;
                            color:white;
                            border:0;
                            border-radius:7px;
                            font-weight:600;
                            cursor:pointer;
                        "
                    >
                        THÊM VÀO GIỎ HÀNG
                    </button>

                </div>

            </div>
        `;


        productModal.classList.add(
            "show"
        );


        document.body.style.overflow =
            "hidden";

    }



    function closeDetail() {

        productModal.classList.remove(
            "show"
        );


        document.body.style.overflow =
            "";

    }



    closeProductModal.addEventListener(
        "click",
        closeDetail
    );


    const modalOverlay =
        productModal.querySelector(
            "[data-close-product]"
        );


    modalOverlay.addEventListener(
        "click",
        closeDetail
    );



    /* =====================================================
       18. CART LOAD
    ===================================================== */

    function loadCart() {

        let rawCart;


        try {

            rawCart =
                JSON.parse(
                    localStorage.getItem(
                        "gearnova_cart"
                    )
                ) || [];

        } catch {

            rawCart =
                [];

        }


        if (
            !Array.isArray(rawCart)
        ) {

            return [];
        }


        const merged =
            new Map();


        rawCart.forEach(
            function (item) {

                let id;
                let quantity;


                if (
                    typeof item ===
                    "number"
                ) {

                    id =
                        item;

                    quantity =
                        1;

                }

                else if (
                    typeof item ===
                    "string"
                ) {

                    id =
                        Number(item);

                    quantity =
                        1;

                }

                else if (
                    item &&
                    item.id !== undefined
                ) {

                    id =
                        Number(
                            item.id
                        );

                    quantity =
                        Number(
                            item.quantity
                            ||
                            item.qty
                            ||
                            1
                        );

                }


                if (
                    !Number.isFinite(id)
                ) {

                    return;
                }


                if (
                    !Number.isFinite(quantity)
                    ||
                    quantity < 1
                ) {

                    quantity =
                        1;

                }


                merged.set(
                    id,
                    (
                        merged.get(id)
                        ||
                        0
                    )
                    +
                    quantity
                );

            }
        );


        return Array.from(
            merged.entries()
        ).map(
            function (
                [id, quantity]
            ) {

                return {
                    id:
                        id,

                    quantity:
                        quantity
                };

            }
        );

    }



    let cart =
        loadCart();



    function saveCart() {

        localStorage.setItem(
            "gearnova_cart",

            JSON.stringify(
                cart
            )
        );

    }



    /* =====================================================
       19. ADD CART
    ===================================================== */

    function addToCart(
        productId
    ) {

        const cartItem =
            cart.find(
                function (item) {

                    return (
                        item.id ===
                        productId
                    );

                }
            );


        if (cartItem) {

            cartItem.quantity +=
                1;

        } else {

            cart.push({
                id:
                    productId,

                quantity:
                    1
            });

        }


        saveCart();

        renderCart();

        showToast(
            "Đã thêm sản phẩm vào giỏ hàng."
        );

    }



    /* =====================================================
       20. PRODUCT GRID CLICK
    ===================================================== */

    productGrid.addEventListener(
        "click",
        function (event) {

            const detailButton =
                event.target.closest(
                    "[data-detail-id]"
                );


            const cartButton =
                event.target.closest(
                    "[data-cart-id]"
                );


            if (detailButton) {

                const productId =
                    Number(
                        detailButton.dataset
                            .detailId
                    );


                openProductDetail(
                    productId
                );

            }


            if (cartButton) {

                const productId =
                    Number(
                        cartButton.dataset
                            .cartId
                    );


                addToCart(
                    productId
                );

            }

        }
    );



    /* =====================================================
       21. MODAL ADD CART
    ===================================================== */

    productDetail.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    "[data-modal-cart]"
                );


            if (!button) {
                return;
            }


            const productId =
                Number(
                    button.dataset
                        .modalCart
                );


            addToCart(
                productId
            );


            closeDetail();

            openCart();

        }
    );



    /* =====================================================
       22. RENDER CART
    ===================================================== */

    function renderCart() {

        cartItems.innerHTML =
            "";


        let total =
            0;


        let totalQuantity =
            0;


        if (
            cart.length === 0
        ) {

            cartEmpty.style.display =
                "flex";

        } else {

            cartEmpty.style.display =
                "none";

        }


        cart.forEach(
            function (item) {

                const product =
                    products.find(
                        function (
                            productItem
                        ) {

                            return (
                                productItem.id
                                ===
                                item.id
                            );

                        }
                    );


                if (!product) {
                    return;
                }


                total +=
                    product.price
                    *
                    item.quantity;


                totalQuantity +=
                    item.quantity;


                const element =
                    document.createElement(
                        "div"
                    );


                element.innerHTML = `

                    <div
                        style="
                            display:grid;
                            grid-template-columns:
                                75px 1fr;
                            gap:14px;
                            padding:15px 0;
                            border-bottom:
                                1px solid #242424;
                        "
                    >

                        <img
                            src="${product.image}"
                            alt="${product.name}"

                            style="
                                width:75px;
                                height:65px;
                                object-fit:cover;
                                border-radius:6px;
                                border:
                                    1px solid #292929;
                            "
                        >


                        <div>

                            <p
                                style="
                                    margin:0 0 6px;
                                    color:white;
                                    font-size:13px;
                                    line-height:1.4;
                                "
                            >
                                ${product.name}
                            </p>


                            <strong
                                style="
                                    display:block;
                                    margin-bottom:10px;
                                    color:#e50914;
                                    font-size:13px;
                                "
                            >
                                ${formatMoney(product.price)}
                            </strong>


                            <div
                                style="
                                    display:flex;
                                    align-items:center;
                                    gap:8px;
                                "
                            >

                                <button
                                    type="button"
                                    data-cart-minus="${product.id}"

                                    style="
                                        width:28px;
                                        height:28px;
                                        background:#151515;
                                        color:white;
                                        border:
                                            1px solid #333;
                                        border-radius:5px;
                                    "
                                >
                                    −
                                </button>


                                <span
                                    style="
                                        min-width:20px;
                                        text-align:center;
                                    "
                                >
                                    ${item.quantity}
                                </span>


                                <button
                                    type="button"
                                    data-cart-plus="${product.id}"

                                    style="
                                        width:28px;
                                        height:28px;
                                        background:#151515;
                                        color:white;
                                        border:
                                            1px solid #333;
                                        border-radius:5px;
                                    "
                                >
                                    +
                                </button>


                                <button
                                    type="button"
                                    data-cart-remove="${product.id}"

                                    style="
                                        margin-left:auto;
                                        background:transparent;
                                        color:#888;
                                        border:0;
                                        font-size:11px;
                                    "
                                >
                                    Xóa
                                </button>

                            </div>

                        </div>

                    </div>
                `;


                cartItems.appendChild(
                    element
                );

            }
        );


        cartCount.textContent =
            totalQuantity;


        cartTotal.textContent =
            formatMoney(
                total
            );

    }



    /* =====================================================
       23. CART ACTION
    ===================================================== */

    cartItems.addEventListener(
        "click",
        function (event) {

            const plus =
                event.target.closest(
                    "[data-cart-plus]"
                );


            const minus =
                event.target.closest(
                    "[data-cart-minus]"
                );


            const remove =
                event.target.closest(
                    "[data-cart-remove]"
                );



            if (plus) {

                const id =
                    Number(
                        plus.dataset
                            .cartPlus
                    );


                const item =
                    cart.find(
                        function (
                            cartItem
                        ) {

                            return (
                                cartItem.id
                                ===
                                id
                            );

                        }
                    );


                if (item) {

                    item.quantity +=
                        1;

                }

            }



            if (minus) {

                const id =
                    Number(
                        minus.dataset
                            .cartMinus
                    );


                const item =
                    cart.find(
                        function (
                            cartItem
                        ) {

                            return (
                                cartItem.id
                                ===
                                id
                            );

                        }
                    );


                if (item) {

                    item.quantity -=
                        1;


                    if (
                        item.quantity <=
                        0
                    ) {

                        cart =
                            cart.filter(
                                function (
                                    cartItem
                                ) {

                                    return (
                                        cartItem.id
                                        !==
                                        id
                                    );

                                }
                            );

                    }

                }

            }



            if (remove) {

                const id =
                    Number(
                        remove.dataset
                            .cartRemove
                    );


                cart =
                    cart.filter(
                        function (
                            item
                        ) {

                            return (
                                item.id
                                !==
                                id
                            );

                        }
                    );

            }


            saveCart();

            renderCart();

        }
    );



    /* =====================================================
       24. OPEN / CLOSE CART
    ===================================================== */

    function openCart() {

        cartDrawer.classList.add(
            "show"
        );

        cartOverlay.classList.add(
            "show"
        );

        document.body.style.overflow =
            "hidden";

    }


    function closeCart() {

        cartDrawer.classList.remove(
            "show"
        );

        cartOverlay.classList.remove(
            "show"
        );

        document.body.style.overflow =
            "";

    }


    cartBtn.addEventListener(
        "click",
        openCart
    );


    closeCartBtn.addEventListener(
        "click",
        closeCart
    );


    cartOverlay.addEventListener(
        "click",
        closeCart
    );



    /* =====================================================
       25. CHECKOUT DEMO
    ===================================================== */

    checkoutBtn.addEventListener(
        "click",
        function () {

            if (
                cart.length === 0
            ) {

                showToast(
                    "Giỏ hàng đang trống."
                );

                return;
            }


            showToast(
                "Chức năng thanh toán đang được phát triển."
            );

        }
    );



    /* =====================================================
       26. TOAST
    ===================================================== */

    let toastTimer;


    function showToast(message) {

        clearTimeout(
            toastTimer
        );


        toast.textContent =
            message;


        toast.classList.add(
            "show"
        );


        toastTimer =
            setTimeout(
                function () {

                    toast.classList.remove(
                        "show"
                    );

                },
                2200
            );

    }



    /* =====================================================
       27. ESC
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key !==
                "Escape"
            ) {

                return;
            }


            searchPanel.classList.remove(
                "show"
            );

            userMenu.classList.remove(
                "show"
            );

            closeDetail();

            closeCart();

        }
    );



    /* =====================================================
       28. KHỞI CHẠY
    ===================================================== */

    renderProducts();

    renderCart();

    updateActiveNavigation();

});