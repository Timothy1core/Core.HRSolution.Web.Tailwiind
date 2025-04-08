import { KTIcon } from '@/_metronic/helpers';
import React, { useState } from "react";

const HeaderWrapper = ({children}) => {


      // const [isMouseInside, setIsMouseInside] = useState(true);

      // const handleMouseEnter = () => setIsMouseInside(true);
      // const handleMouseLeave = () => setIsMouseInside(false);

      // const [isFullscreen, setIsFullscreen] = useState(false);
      // const toggleFullscreen = () => {
      //   if (!isFullscreen) {
      //     const elem = document.documentElement; // Fullscreen the whole page
      //     if (elem.requestFullscreen) {
      //       elem.requestFullscreen();
      //     } else if (elem.webkitRequestFullscreen) { // Safari
      //       elem.webkitRequestFullscreen();
      //     } else if (elem.mozRequestFullScreen) { // Firefox
      //       elem.mozRequestFullScreen();
      //     } else if (elem.msRequestFullscreen) { // IE/Edge
      //       elem.msRequestFullscreen();
      //     }
      //     setIsFullscreen(true);
      //   } else {
      //     if (document.exitFullscreen) {
      //       document.exitFullscreen();
      //     } else if (document.webkitExitFullscreen) { // Safari
      //       document.webkitExitFullscreen();
      //     } else if (document.mozCancelFullScreen) { // Firefox
      //       document.mozCancelFullScreen();
      //     } else if (document.msExitFullscreen) { // IE/Edge
      //       document.msExitFullscreen();
      //     }
      //     setIsFullscreen(false);
      //   }
      // };

    return (
      <div id="kt_app_header" className="shadow-sm border border-gray-300 app-header py-3">
        {/* <div > */}
          {/* Left Section */}
          
          {/* Center Section */}
          {children}

          {/* Right Section */}
          {/* <div className="right-island"> */}
            {/* <button type='submit' className='btn btn-danger rounded-pill align-items-center' onClick={toggleFullscreen}>
              <span className='indicator-label'>Next <KTIcon iconName='right' iconType='outline' className='text-white' /> </span>
            </button> */}
          {/* </div> */}
        {/* </div> */}
          {/* <div hidden
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              width: '200px',
              height: '200px',
              backgroundColor: isMouseInside ? 'lightblue' : 'lightcoral',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
        {isMouseInside ? 'Mouse is inside' : 'Mouse is outside'}
      </div> */}
      </div>
    );
  };
  
  export { HeaderWrapper };
  