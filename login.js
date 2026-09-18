/* GearNova - đăng nhập */
document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");
  const togglePassword = document.getElementById("togglePassword");
  const button = document.getElementById("loginBtn");
  const message = document.getElementById("loginMessage");

  const showMessage = (text, type = "") => {
    message.textContent = text;
    message.className = `form-message${type ? ` is-${type}` : ""}`;
  };
  const setLoading = (loading, text) => {
    button.disabled = loading;
    button.textContent = text;
  };

  if (!window.sb) {
    showMessage("Không thể kết nối dịch vụ đăng nhập. Kiểm tra supabase-client.js.", "error");
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
    togglePassword.textContent = hidden ? "Ẩn" : "Hiện";
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if (!email || !password) {
      showMessage("Vui lòng nhập email và mật khẩu.", "error");
      return;
    }

    setLoading(true, "Đang đăng nhập…");
    showMessage("");
    const { error } = await window.sb.auth.signInWithPassword({ email, password });
    setLoading(false, "Đăng nhập");

    if (error) {
      showMessage("Email hoặc mật khẩu chưa đúng.", "error");
      return;
    }

    window.location.replace("./index.html");
  });
});
