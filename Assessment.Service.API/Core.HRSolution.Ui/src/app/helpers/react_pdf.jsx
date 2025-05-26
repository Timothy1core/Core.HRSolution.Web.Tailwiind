import React, { useState, useEffect } from 'react';
import { Viewer, Worker, SpecialZoomLevel  } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import { ApiGateWayUrl} from '../modules/recruitment/candidates/core/requests/_request';


const PDFViewer = ({ candidateId }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  return (
    <div style={{
      border: '1px solid rgba(0, 0, 0, 0.3)',
      height: '750px',
  }}>
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <Viewer fileUrl={`${ApiGateWayUrl()}/recruitment/candidate/candidate_resume/${candidateId}`}  plugins={[defaultLayoutPluginInstance]} defaultScale={SpecialZoomLevel.PageFit}/>
          </Worker>
        </div>
  );
}

export {PDFViewer};
