/* =========================================================
   GEARNOVA - INDEX.JS
========================================================= */

document.addEventListener("DOMContentLoaded", async function () {

    /* =====================================================
       1. SUPABASE AUTH
    ===================================================== */

    if (!window.sb) {
        console.error("Supabase chưa được khởi tạo.");
        window.location.replace("./login.html");
        return;
    }

    let session = null;

    try {

        const {
            data,
            error
        } = await window.sb.auth.getSession();

        if (error) {
            throw error;
        }

        session = data.session;

    } catch (error) {

        console.error("SESSION ERROR:", error);

        window.location.replace("./login.html");
        return;
    }

    if (!session) {

        localStorage.removeItem(
            "gearnova_current_user"
        );

        window.location.replace(
            "./login.html"
        );

        return;
    }


    /* =====================================================
       2. USER
    ===================================================== */

    const user = session.user;

    const displayName =
        user.user_metadata?.display_name ||
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "User";

    const currentUser = {
        id: user.id,
        username: displayName,
        email: user.email
    };

    localStorage.setItem(
        "gearnova_current_user",
        JSON.stringify(currentUser)
    );


    /* =====================================================
       3. DOM
    ===================================================== */

    const usernameDisplay =
        document.getElementById("usernameDisplay");

    const menuUsername =
        document.getElementById("menuUsername");

    const userBtn =
        document.getElementById("userBtn");

    const userMenu =
        document.getElementById("userMenu");

    const logoutBtn =
        document.getElementById("logoutBtn");


    const openSearchBtn =
        document.getElementById("openSearchBtn");

    const searchPanel =
        document.getElementById("searchPanel");

    const searchInput =
        document.getElementById("searchInput");

    const closeSearchBtn =
        document.getElementById("closeSearchBtn");


    const navLinks =
        document.querySelectorAll(".nav-link");

    const categoryCards =
        document.querySelectorAll(".category-card");


    const productGrid =
        document.getElementById("productGrid");

    const productResult =
        document.getElementById("productResult");

    const emptyProducts =
        document.getElementById("emptyProducts");


    const productModal =
        document.getElementById("productModal");

    const productDetail =
        document.getElementById("productDetail");

    const closeProductModal =
        document.getElementById("closeProductModal");


    const cartBtn =
        document.getElementById("cartBtn");

    const cartCount =
        document.getElementById("cartCount");

    const cartOverlay =
        document.getElementById("cartOverlay");

    const cartDrawer =
        document.getElementById("cartDrawer");

    const closeCartBtn =
        document.getElementById("closeCartBtn");

    const cartItems =
        document.getElementById("cartItems");

    const cartEmpty =
        document.getElementById("cartEmpty");

    const cartTotal =
        document.getElementById("cartTotal");

    const checkoutBtn =
        document.getElementById("checkoutBtn");

    const toast =
        document.getElementById("toast");


    /* =====================================================
       4. USER DISPLAY
    ===================================================== */

    if (usernameDisplay) {
        usernameDisplay.textContent =
            currentUser.username;
    }

    if (menuUsername) {
        menuUsername.textContent =
            currentUser.username;
    }


    /* =====================================================
       5. TẠO ẢNH SẢN PHẨM
    ===================================================== */

    function createProductImage(title, subtitle) {

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
       6. PRODUCTS
    ===================================================== */

    const products = [

        /* ================= VGA ================= */

        {
            id: 1,
            name: "ASUS Dual GeForce RTX 4060 OC 8GB",
            category: "VGA",
            price: 8290000,
            image: createProductImage(
                "RTX 4060",
                "ASUS DUAL"
            ),
            description:
                "Card đồ họa RTX 4060 dành cho gaming Full HD, hỗ trợ Ray Tracing và DLSS.",
            specs: [
                "VRAM: 8GB GDDR6",
                "NVIDIA Ada Lovelace",
                "Ray Tracing",
                "DLSS"
            ]
        },

        {
            id: 2,
            name: "MSI GeForce RTX 4060 Ti Ventus 2X 8GB",
            category: "VGA",
            price: 10990000,
            image: createProductImage(
                "RTX 4060 Ti",
                "MSI VENTUS"
            ),
            description:
                "Card đồ họa RTX 4060 Ti phù hợp gaming Full HD và 2K.",
            specs: [
                "8GB GDDR6",
                "Dual Fan",
                "Ray Tracing",
                "DLSS 3"
            ]
        },

        {
            id: 3,
            name: "Gigabyte GeForce RTX 4070 SUPER Gaming OC 12GB",
            category: "VGA",
            price: 17990000,
            image: createProductImage(
                "RTX 4070",
                "SUPER"
            ),
            description:
                "Card đồ họa mạnh mẽ dành cho gaming độ phân giải 2K.",
            specs: [
                "12GB GDDR6X",
                "Triple Fan",
                "Ray Tracing",
                "DLSS 3"
            ]
        },

        {
            id: 4,
            name: "Sapphire Radeon RX 7600 Pulse 8GB",
            category: "VGA",
            price: 7290000,
            image: createProductImage(
                "RX 7600",
                "RADEON"
            ),
            description:
                "Card đồ họa AMD Radeon phù hợp gaming Full HD.",
            specs: [
                "8GB GDDR6",
                "AMD RDNA 3",
                "Dual Fan",
                "PCIe 4.0"
            ]
        },


        /* ================= CPU ================= */

        {
            id: 5,
            name: "AMD Ryzen 5 7600",
            category: "CPU",
            price: 4890000,
            image: createProductImage(
                "RYZEN 5",
                "7600"
            ),
            description:
                "CPU AMD Ryzen dành cho gaming và làm việc đa nhiệm.",
            specs: [
                "6 nhân / 12 luồng",
                "Socket AM5",
                "Zen 4",
                "TDP 65W"
            ]
        },

        {
            id: 6,
            name: "AMD Ryzen 7 7700",
            category: "CPU",
            price: 7490000,
            image: createProductImage(
                "RYZEN 7",
                "7700"
            ),
            description:
                "CPU Ryzen 7 phù hợp gaming, stream và làm việc.",
            specs: [
                "8 nhân / 16 luồng",
                "Socket AM5",
                "Zen 4",
                "TDP 65W"
            ]
        },

        {
            id: 7,
            name: "Intel Core i5-14400F",
            category: "CPU",
            price: 5290000,
            image: createProductImage(
                "CORE i5",
                "14400F"
            ),
            description:
                "Intel Core i5 phù hợp PC gaming tầm trung.",
            specs: [
                "10 nhân",
                "16 luồng",
                "LGA1700",
                "Không tích hợp GPU"
            ]
        },

        {
            id: 8,
            name: "Intel Core i7-14700F",
            category: "CPU",
            price: 9290000,
            image: createProductImage(
                "CORE i7",
                "14700F"
            ),
            description:
                "Intel Core i7 hiệu năng cao cho gaming và workstation.",
            specs: [
                "20 nhân",
                "28 luồng",
                "LGA1700",
                "Không tích hợp GPU"
            ]
        },


        /* ================= RAM ================= */

        {
            id: 9,
            name: "Kingston Fury Beast 16GB DDR5",
            category: "RAM",
            price: 1390000,
            image: createProductImage(
                "FURY",
                "16GB DDR5"
            ),
            description:
                "RAM DDR5 dành cho PC gaming thế hệ mới.",
            specs: [
                "16GB",
                "DDR5",
                "Tản nhiệt kim loại",
                "Gaming"
            ]
        },

        {
            id: 10,
            name: "Kingston Fury Beast 32GB DDR5 Kit",
            category: "RAM",
            price: 2490000,
            image: createProductImage(
                "FURY",
                "32GB DDR5"
            ),
            description:
                "Bộ RAM 32GB phù hợp gaming và đa nhiệm.",
            specs: [
                "32GB",
                "2 x 16GB",
                "DDR5",
                "Dual Channel"
            ]
        },

        {
            id: 11,
            name: "Corsair Vengeance RGB 32GB DDR5",
            category: "RAM",
            price: 2890000,
            image: createProductImage(
                "VENGEANCE",
                "32GB RGB"
            ),
            description:
                "RAM Corsair DDR5 RGB dành cho bộ máy gaming.",
            specs: [
                "32GB",
                "DDR5",
                "RGB",
                "Dual Channel"
            ]
        },

        {
            id: 12,
            name: "G.Skill Trident Z5 RGB 32GB DDR5",
            category: "RAM",
            price: 3190000,
            image: createProductImage(
                "TRIDENT Z5",
                "RGB DDR5"
            ),
            description:
                "RAM DDR5 hiệu năng cao với hệ thống RGB.",
            specs: [
                "32GB",
                "DDR5",
                "RGB",
                "Gaming"
            ]
        },


        /* ================= SSD ================= */

        {
            id: 13,
            name: "Samsung 990 EVO 1TB NVMe",
            category: "SSD",
            price: 2490000,
            image: createProductImage(
                "990 EVO",
                "1TB NVME"
            ),
            description:
                "SSD NVMe tốc độ cao dành cho Windows và gaming.",
            specs: [
                "1TB",
                "M.2 NVMe",
                "PCIe",
                "Samsung"
            ]
        },

        {
            id: 14,
            name: "Samsung 990 PRO 2TB NVMe",
            category: "SSD",
            price: 4590000,
            image: createProductImage(
                "990 PRO",
                "2TB NVME"
            ),
            description:
                "SSD Samsung cao cấp dành cho hệ thống hiệu năng cao.",
            specs: [
                "2TB",
                "NVMe",
                "PCIe 4.0",
                "Hiệu năng cao"
            ]
        },

        {
            id: 15,
            name: "Kingston NV3 1TB NVMe",
            category: "SSD",
            price: 1590000,
            image: createProductImage(
                "NV3",
                "1TB NVME"
            ),
            description:
                "SSD NVMe dung lượng 1TB dành cho PC phổ thông.",
            specs: [
                "1TB",
                "M.2 2280",
                "NVMe",
                "PCIe"
            ]
        },

        {
            id: 16,
            name: "WD Black SN850X 1TB NVMe",
            category: "SSD",
            price: 2690000,
            image: createProductImage(
                "SN850X",
                "WD BLACK"
            ),
            description:
                "SSD gaming WD Black hiệu năng cao.",
            specs: [
                "1TB",
                "PCIe 4.0",
                "NVMe",
                "Gaming SSD"
            ]
        },


        /* ================= GEAR ================= */

        {
            id: 17,
            name: "Keychron K2 Pro Mechanical Keyboard",
            category: "Gear",
            price: 2390000,
            image: createProductImage(
                "K2 PRO",
                "KEYCHRON"
            ),
            description:
                "Bàn phím cơ không dây nhỏ gọn.",
            specs: [
                "Layout 75%",
                "Mechanical",
                "Bluetooth",
                "USB-C"
            ]
        },

        {
            id: 18,
            name: "Logitech G502 X Gaming Mouse",
            category: "Gear",
            price: 1890000,
            image: createProductImage(
                "G502 X",
                "LOGITECH"
            ),
            description:
                "Chuột gaming Logitech với cảm biến chính xác.",
            specs: [
                "Gaming Sensor",
                "Programmable Buttons",
                "Ergonomic",
                "USB"
            ]
        },

        {
            id: 19,
            name: "HyperX Cloud III Gaming Headset",
            category: "Gear",
            price: 1990000,
            image: createProductImage(
                "CLOUD III",
                "HYPERX"
            ),
            description:
                "Tai nghe gaming HyperX với microphone.",
            specs: [
                "Gaming Headset",
                "Microphone",
                "Âm thanh chất lượng cao",
                "Đệm tai mềm"
            ]
        },

        {
            id: 20,
            name: "Razer BlackWidow V4 X",
            category: "Gear",
            price: 3290000,
            image: createProductImage(
                "BLACKWIDOW",
                "V4 X"
            ),
            description:
                "Bàn phím cơ Razer RGB dành cho gaming.",
            specs: [
                "Mechanical",
                "Full Size",
                "RGB",
                "Gaming"
            ]
        },

        {
            id: 21,
            name: "Razer DeathAdder V3",
            category: "Gear",
            price: 1690000,
            image: createProductImage(
                "DEATHADDER",
                "V3"
            ),
            description:
                "Chuột gaming Razer trọng lượng nhẹ.",
            specs: [
                "Ergonomic",
                "Gaming Sensor",
                "Lightweight",
                "USB"
            ]
        },

        {
            id: 22,
            name: "SteelSeries Arctis Nova 5",
            category: "Gear",
            price: 3290000,
            image: createProductImage(
                "ARCTIS",
                "NOVA 5"
            ),
            description:
                "Tai nghe gaming không dây SteelSeries.",
            specs: [
                "Wireless",
                "Microphone",
                "Gaming",
                "Surround Audio"
            ]
        },

        {
            id: 23,
            name: "Logitech G Pro X 2 Lightspeed",
            category: "Gear",
            price: 5290000,
            image: createProductImage(
                "PRO X 2",
                "LIGHTSPEED"
            ),
            description:
                "Tai nghe gaming Logitech không dây cao cấp.",
            specs: [
                "LIGHTSPEED",
                "Wireless",
                "Bluetooth",
                "Microphone"
            ]
        },

        {
            id: 24,
            name: "Logitech G Pro X Superlight 2",
            category: "Gear",
            price: 3490000,
            image: createProductImage(
                "SUPERLIGHT",
                "PRO X 2"
            ),
            description:
                "Chuột gaming không dây siêu nhẹ dành cho FPS.",
            specs: [
                "Wireless",
                "Lightweight",
                "Gaming Sensor",
                "Pin sạc"
            ]
        }

    ];


    /* =====================================================
       7. FORMAT MONEY
    ===================================================== */

    function formatMoney(value) {

        return new Intl.NumberFormat(
            "vi-VN",
            {
                style: "currency",
                currency: "VND"
            }
        ).format(value);

    }


    /* =====================================================
       8. NORMALIZE
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
       9. FILTER STATE
    ===================================================== */

    let selectedCategory =
        "all";

    let searchKeyword =
        "";


    const categoryNames = {
        all: "Tất cả",
        CPU: "CPU",
        VGA: "GPU / VGA",
        RAM: "RAM",
        SSD: "SSD",
        Gear: "Gaming Gear"
    };


    /* =====================================================
       10. RENDER PRODUCTS
    ===================================================== */

    function renderProducts() {

        const keyword =
            normalizeText(searchKeyword);


        const filteredProducts =
            products.filter(function (product) {

                const categoryMatch =
                    selectedCategory === "all"
                    ||
                    product.category === selectedCategory;


                const searchable =
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
                    searchable.includes(keyword);


                return (
                    categoryMatch &&
                    searchMatch
                );

            });


        productGrid.innerHTML =
            "";


        if (filteredProducts.length === 0) {

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
       11. PRODUCT RESULT
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


        if (searchKeyword !== "") {

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
            categoryNames[selectedCategory]
            +
            " • "
            +
            count
            +
            " sản phẩm";

    }


    /* =====================================================
       12. CATEGORY
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
                        .getElementById("products")
                        .scrollIntoView({
                            behavior: "smooth"
                        });

                }
            );

        }
    );


    /* =====================================================
       13. SEARCH
    ===================================================== */

    if (openSearchBtn) {

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

    }


    if (closeSearchBtn) {

        closeSearchBtn.addEventListener(
            "click",
            function () {

                searchPanel.classList.remove(
                    "show"
                );

            }
        );

    }


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                searchKeyword =
                    this.value.trim();


                renderProducts();

            }
        );

    }


    /* =====================================================
       14. HEADER NAV
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


    const sections = [

        document.getElementById("home"),
        document.getElementById("products"),
        document.getElementById("categories"),
        document.getElementById("about")

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
                    link.getAttribute("href")
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

    if (userBtn) {

        userBtn.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                userMenu.classList.toggle(
                    "show"
                );

            }
        );

    }


    document.addEventListener(
        "click",
        function (event) {

            if (
                userMenu
                &&
                !userMenu.contains(event.target)
                &&
                !userBtn.contains(event.target)
            ) {

                userMenu.classList.remove(
                    "show"
                );

            }

        }
    );


    /* =====================================================
       16. LOGOUT SUPABASE
    ===================================================== */

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            async function () {

                logoutBtn.disabled =
                    true;

                logoutBtn.textContent =
                    "Đang đăng xuất...";


                try {

                    const {
                        error
                    } =
                        await window.sb.auth
                            .signOut();


                    if (error) {
                        throw error;
                    }


                } catch (error) {

                    console.error(
                        "LOGOUT ERROR:",
                        error
                    );

                } finally {

                    localStorage.removeItem(
                        "gearnova_current_user"
                    );


                    window.location.replace(
                        "./login.html"
                    );

                }

            }
        );

    }


    /* =====================================================
       17. PRODUCT DETAIL
    ===================================================== */

    function openProductDetail(productId) {

        const product =
            products.find(
                function (item) {

                    return (
                        item.id === productId
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
                        minmax(260px,1fr)
                        minmax(280px,1fr);
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
                                    spec =>
                                        "<li>"
                                        +
                                        spec
                                        +
                                        "</li>"
                                )
                                .join("")
                        }

                    </ul>


                    <p
                        style="
                            margin:22px 0;
                            font-size:24px;
                            font-weight:600;
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


    if (closeProductModal) {

        closeProductModal.addEventListener(
            "click",
            closeDetail
        );

    }


    const modalOverlay =
        productModal?.querySelector(
            "[data-close-product]"
        );


    if (modalOverlay) {

        modalOverlay.addEventListener(
            "click",
            closeDetail
        );

    }


    /* =====================================================
       18. CART
    ===================================================== */

    function loadCart() {

        try {

            const data =
                JSON.parse(
                    localStorage.getItem(
                        "gearnova_cart"
                    )
                ) || [];


            return Array.isArray(data)
                ? data
                : [];

        } catch {

            return [];

        }

    }


    let cart =
        loadCart();


    function saveCart() {

        localStorage.setItem(
            "gearnova_cart",
            JSON.stringify(cart)
        );

    }


    function addToCart(productId) {

        const item =
            cart.find(
                function (cartItem) {

                    return (
                        Number(cartItem.id)
                        ===
                        Number(productId)
                    );

                }
            );


        if (item) {

            item.quantity =
                Number(
                    item.quantity || 1
                )
                +
                1;

        } else {

            cart.push({
                id: productId,
                quantity: 1
            });

        }


        saveCart();

        renderCart();

        showToast(
            "Đã thêm sản phẩm vào giỏ hàng."
        );

    }


    if (productGrid) {

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

                    openProductDetail(
                        Number(
                            detailButton.dataset
                                .detailId
                        )
                    );

                }


                if (cartButton) {

                    addToCart(
                        Number(
                            cartButton.dataset
                                .cartId
                        )
                    );

                }

            }
        );

    }


    if (productDetail) {

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


                addToCart(
                    Number(
                        button.dataset
                            .modalCart
                    )
                );


                closeDetail();

                openCart();

            }
        );

    }


    /* =====================================================
       19. RENDER CART
    ===================================================== */

    function renderCart() {

        cartItems.innerHTML =
            "";


        let total =
            0;

        let totalQuantity =
            0;


        if (cart.length === 0) {

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
                        function (productItem) {

                            return (
                                productItem.id
                                ===
                                Number(item.id)
                            );

                        }
                    );


                if (!product) {
                    return;
                }


                const quantity =
                    Number(
                        item.quantity || 1
                    );


                total +=
                    product.price
                    *
                    quantity;


                totalQuantity +=
                    quantity;


                const element =
                    document.createElement(
                        "div"
                    );


                element.innerHTML = `

                    <div
                        style="
                            display:grid;
                            grid-template-columns:75px 1fr;
                            gap:14px;
                            padding:15px 0;
                            border-bottom:1px solid #242424;
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
                                border:1px solid #292929;
                            "
                        >


                        <div>

                            <p
                                style="
                                    margin:0 0 6px;
                                    color:white;
                                    font-size:13px;
                                "
                            >
                                ${product.name}
                            </p>


                            <strong
                                style="
                                    display:block;
                                    margin-bottom:10px;
                                    color:#e50914;
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
                                    data-cart-minus="${product.id}"
                                >
                                    −
                                </button>


                                <span>
                                    ${quantity}
                                </span>


                                <button
                                    data-cart-plus="${product.id}"
                                >
                                    +
                                </button>


                                <button
                                    data-cart-remove="${product.id}"
                                    style="
                                        margin-left:auto;
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
            formatMoney(total);

    }


    /* =====================================================
       20. CART ACTION
    ===================================================== */

    if (cartItems) {

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
                            plus.dataset.cartPlus
                        );


                    const item =
                        cart.find(
                            item =>
                                Number(item.id)
                                ===
                                id
                        );


                    if (item) {

                        item.quantity =
                            Number(
                                item.quantity || 1
                            )
                            +
                            1;

                    }

                }


                if (minus) {

                    const id =
                        Number(
                            minus.dataset.cartMinus
                        );


                    const item =
                        cart.find(
                            item =>
                                Number(item.id)
                                ===
                                id
                        );


                    if (item) {

                        item.quantity =
                            Number(
                                item.quantity || 1
                            )
                            -
                            1;


                        if (
                            item.quantity <= 0
                        ) {

                            cart =
                                cart.filter(
                                    item =>
                                        Number(item.id)
                                        !==
                                        id
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
                            item =>
                                Number(item.id)
                                !==
                                id
                        );

                }


                saveCart();

                renderCart();

            }
        );

    }


    /* =====================================================
       21. CART OPEN CLOSE
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


    cartBtn?.addEventListener(
        "click",
        openCart
    );

    closeCartBtn?.addEventListener(
        "click",
        closeCart
    );

    cartOverlay?.addEventListener(
        "click",
        closeCart
    );


    /* =====================================================
       22. CHECKOUT
    ===================================================== */

    checkoutBtn?.addEventListener(
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
       23. TOAST
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
       24. ESC
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


            searchPanel?.classList.remove(
                "show"
            );

            userMenu?.classList.remove(
                "show"
            );

            closeDetail();

            closeCart();

        }
    );


    /* =====================================================
       25. START
    ===================================================== */

    renderProducts();

    renderCart();

    updateActiveNavigation();


    console.log(
        "GearNova đã khởi động:",
        products.length,
        "sản phẩm"
    );

});
