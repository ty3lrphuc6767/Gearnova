/* GearNova - đăng ký */
document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("registerForm");
  const nameInput = document.getElementById("registerName");
  const emailInput = document.getElementById("registerEmail");
  const passwordInput = document.getElementById("registerPassword");
  const confirmInput = document.getElementById("confirmPassword");
  const togglePassword = document.getElementById("togglePassword");
  const button = document.getElementById("registerBtn");
  const message = document.getElementById("registerMessage");

  const showMessage = (text, type = "") => {
    message.textContent = text;
    message.className = `form-message${type ? ` is-${type}` : ""}`;
  };
  const setLoading = (loading, text) => {
    button.disabled = loading;
    button.textContent = text;
  };

  if (!window.sb) {
    showMessage("Không thể kết nối dịch vụ đăng ký. Kiểm tra supabase-client.js.", "error");
    return;
  }

  try {
    const { data } = await window.sb.auth.getSession();
    if (data.session) {
      window.location.replace("./index.html");
      return;
    }
  } catch (error) {
    console.warn("Không kiểm tra được phiên hiện tại:", error);
  }

  togglePassword.addEventListener("click", () => {
    const hidden = passwordInput.type === "password";
    passwordInput.type = hidden ? "text" : "password";
    confirmInput.type = hidden ? "text" : "password";
    togglePassword.textContent = hidden ? "Ẩn" : "Hiện";
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const displayName = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    const confirmation = confirmInput.value;

    if (!displayName || !email || !password || !confirmation) {
      showMessage("Vui lòng nhập đầy đủ thông tin.", "error");
      return;
    }
    if (password.length < 6) {
      showMessage("Mật khẩu phải có ít nhất 6 ký tự.", "error");
      return;
    }
    if (password !== confirmation) {
      showMessage("Mật khẩu xác nhận chưa khớp.", "error");
      return;
    }

    const redirectTo = window.location.protocol === "file:"
      ? undefined
      : `${window.location.origin}${window.location.pathname.replace(/\/[^/]*$/, "/")}login.html`;

    setLoading(true, "Đang tạo tài khoản…");
    showMessage("");
    const { data, error } = await window.sb.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
        ...(redirectTo ? { emailRedirectTo: redirectTo } : {}),
      },
    });
    setLoading(false, "Tạo tài khoản");

    if (error) {
      showMessage(error.message, "error");
      return;
    }

    if (data.session) {
      window.location.replace("./index.html");
      return;
    }

    showMessage("Tài khoản đã được tạo. Hãy kiểm tra email để xác thực rồi đăng nhập.", "success");
    form.reset();
  });
});
