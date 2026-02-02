/**
 * تم تحسين الكود لدمج وظائف المعرض والـ Lightbox ومنع التكرار
 * وتم استخدام المنطق الأسرع في معالجة الصور
 */

document.addEventListener("DOMContentLoaded", function () {
  // === 1. إدارة قائمة التنقل (Navbar) ===
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () =>
      navMenu.classList.toggle("show"),
    );

    // إغلاق القائمة عند النقر على أي رابط أو خارجها
    document.addEventListener("click", (e) => {
      const isClickInside =
        navMenu.contains(e.target) || menuToggle.contains(e.target);
      if (!isClickInside || e.target.tagName === "A") {
        navMenu.classList.remove("show");
      }
    });
  }

  // === 2. منطق المعارض (Show More/Less + Lazy Loading) ===
  const toggleButtons = document.querySelectorAll(".toggle-gallery-btn");

  toggleButtons.forEach((button) => {
    const targetType = button.getAttribute("data-target");
    const container = document.querySelector(
      `.gallery-container[data-gallery="${targetType}"]`,
    );

    // إخفاء الزر إذا كان عدد الصور قليل (أقل من 3)
    const allWrappers = container.querySelectorAll(".image-wrapper");
    if (allWrappers.length <= 2) {
      button.style.display = "none";
    }

    button.addEventListener("click", function () {
      const isExpanding = !this.classList.contains("expanded");
      const hiddenWrappers = container.querySelectorAll(
        ".image-wrapper.hidden",
      );
      const spanText = this.querySelector("span");

      if (isExpanding) {
        // إظهار وتحميل الصور (Lazy Load)
        allWrappers.forEach((wrapper) => {
          const img = wrapper.querySelector("img");
          // تفعيل الصور المخفية فقط
          if (img && img.hasAttribute("data-src")) {
            img.src = img.getAttribute("data-src");
            img.removeAttribute("data-src");
          }
          wrapper.classList.remove("hidden");
        });
        spanText.textContent = "عرض أقل";
        this.classList.add("expanded");
      } else {
        // إخفاء الصور الزائدة (إبقاء أول صورتين)
        allWrappers.forEach((wrapper, index) => {
          if (index >= 2 || wrapper.classList.contains("NotShow")) wrapper.classList.add("hidden");
        });
        spanText.textContent = "عرض المزيد";
        this.classList.remove("expanded");
        // العودة للأعلى بسلاسة عند الإغلاق
        container.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // === 3. منطق النافذة المنبثقة (Lightbox) ===
  const modal = document.getElementById("lightbox");
  const modalImg = document.getElementById("full-res-img");
  const downloadLink = document.getElementById("download-link");
  const captionText = document.getElementById("caption");

  if (modal) {
    // استخدام التفويض (Delegation) لفتح أي صورة تحمل كلاس lightbox-trigger
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("lightbox-trigger")) {
        modal.style.display = "block";
        modalImg.src = e.target.src;
        if (downloadLink) downloadLink.href = e.target.src;
        if (captionText) captionText.innerHTML = e.target.alt;
      }
    });

    // إغلاق النافذة عند النقر على X أو خارج الصورة
    const closeBtn = document.querySelector(".close-lightbox");
    if (closeBtn) closeBtn.onclick = () => (modal.style.display = "none");

    window.onclick = (e) => {
      if (e.target === modal) modal.style.display = "none";
    };
  }
});
