
const ToolbarWrapper = ({title, subtitle}) => {

  return (
    <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
      <div id="kt_app_toolbar_container" className="app-container container-fluid d-flex flex-stack">
        <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
            <span className='card-label fw-bold fs-3'>{title}</span>
            <span className='text-muted mt-1 fw-semibold fs-7'>{subtitle}</span>
        </div>
      </div>
    </div>

    // <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
    //   <div id="kt_app_toolbar_container" className="app-container container-fluid d-flex flex-stack">
    //     <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
    //         <span className='card-label fw-bold fs-3 text-uppercase'>{title}</span>
    //         <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
    //             <li className="breadcrumb-item text-muted text-uppercase">
    //                 <a href="?page=index" className="text-muted text-hover-primary ">{subtitle}</a>
    //             </li>
    //             <li class="breadcrumb-item">
    //                 <span class="bullet bg-gray-500 w-5px h-2px"></span>
    //             </li>
    //             <li class="breadcrumb-item text-muted text-uppercase">{title}</li>
    //         </ul>
    //     </div>
    //     <div className="d-flex align-items-center gap-2 gap-lg-3">
    //       <div className="me-5">
    //         <h6 className="fs-9 text-uppercase text-muted">Current IP Address</h6>
    //         <h4 className="fs-5 text-danger">@Model.PublicIp</h4>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  )
}

export { ToolbarWrapper }
