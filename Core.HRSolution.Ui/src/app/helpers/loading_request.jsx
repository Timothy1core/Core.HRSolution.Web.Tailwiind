const enableLoadingRequest = () => {
    if (document.querySelector(".page-loader")) {
      return;
    }
  
    document.body.setAttribute("data-kt-app-page-loading", "on");
    document.body.classList.add("page-loading");
  
    const loadingEl = document.createElement("div");
    document.body.prepend(loadingEl);
    loadingEl.classList.add("page-loader");
    loadingEl.classList.add("flex-column");
    loadingEl.classList.add("bg-dark");
    loadingEl.classList.add("bg-opacity-25");
    loadingEl.innerHTML = `
      <span class="spinner-border text-danger" role="status"></span>
      <span class="text-dark fs-5 fw-semibold mt-5">Loading, please wait...</span>
    `;
  };
  
  const disableLoadingRequest = () => {
    document.body.removeAttribute("data-kt-app-page-loading");
    document.body.classList.remove("page-loading");
  
    const loadingEl = document.querySelector(".page-loader");
    if (loadingEl) {
      loadingEl.remove();
    }
  };
  
  export { enableLoadingRequest, disableLoadingRequest };
  