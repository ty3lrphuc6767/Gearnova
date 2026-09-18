/* GearNova - lớp xác thực dùng chung. Không chèn script động. */
(function () {
  "use strict";

  function goToLogin() {
    window.location.replace("./login.html");
  }

  async function getSession() {
    if (!window.sb) return null;

    const { data, error } = await window.sb.auth.getSession();
    if (error) throw error;
    return data.session || null;
  }

  async function requireSession() {
    try {
      const session = await getSession();
      if (!session) {
        goToLogin();
        return null;
      }
      return session;
    } catch (error) {
      console.error("Không thể kiểm tra phiên đăng nhập:", error);
      goToLogin();
      return null;
    }
  }

  async function getProfile(userId) {
    if (!window.sb || !userId) return { role: "user" };

    const { data, error } = await window.sb
      .from("profiles")
      .select("display_name, email, role")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.warn("Không tải được profile:", error.message);
      return { role: "user" };
    }

    return data || { role: "user" };
  }

  async function signOut() {
    if (window.sb) {
      const { error } = await window.sb.auth.signOut();
      if (error) throw error;
    }
    localStorage.removeItem("gearnova_cart");
  }

  window.GearNovaAuth = { getSession, requireSession, getProfile, signOut, goToLogin };
})();
