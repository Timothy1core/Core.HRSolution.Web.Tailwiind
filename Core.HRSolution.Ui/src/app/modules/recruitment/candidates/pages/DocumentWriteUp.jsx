import React, { useRef, useState, useEffect } from 'react';
// import { Form } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { Content } from '../../../../../_metronic/layout/components/content';
import { KTIcon } from '@/_metronic/helpers';
// import { toAbsoluteUrl } from '@/_metronic/utils';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Bold, Essentials, Italic, Paragraph, List, Heading, Link, Table, Indent, IndentBlock, Image, ImageCaption, ImageResize, ImageStyle, ImageToolbar, ImageUpload, Base64UploadAdapter, FontSize } from 'ckeditor5';
import { infoWriteUp } from '../core/requests/_request';

const DocumentWriteUpPage = () => {
  const CKEditorConfig = {
    plugins: [
      Essentials, Bold, Italic, Paragraph, List, Heading, Link,
      Table, Indent, IndentBlock, Image,
      ImageCaption, ImageResize, ImageStyle, ImageToolbar,
      ImageUpload, Base64UploadAdapter, FontSize
    ],
    toolbar: [
      'undo', 'redo', '|', 'heading', '|',
      'bulletedList', 'numberedList', '|',
      'bold', 'italic', '|',
      'insertTable', '|', 'indent', 'outdent'
    ],
    // table: {
    //   contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
    // },
    viewportTopOffset: 60
  };

  const printTemplate = `
<html>

<head>
    <link href="https://cdn.onecoredevit.com/metronic/assets/plugins/global/plugins.bundle.css" rel="stylesheet" type="text/css" />
    <link href="https://cdn.onecoredevit.com/metronic/assets/css/style.bundle.css" rel="stylesheet" type="text/css" />
    <link href="https://cdn.onecoredevit.com/metronic/assets/css/custom.layout.css" rel="stylesheet" type="text/css" />

    <link href="https://cdn.onecoredevit.com/fonts/fontawesome6/css/all.min.css" rel="stylesheet" type="text/css" />
</head>
<style>


    @import url('https://fonts.googleapis.com/css2?family=Albert+Sans:ital,wght@0,100..900;1,100..900&display=swap');


    body {
        margin: 0 auto;
        font-family: "Albert Sans", sans-serif;
        font-size: 14px;
        max-width: 800px;
        width: 100%;
    }

    p {
        margin: 0px;
    }

    .text-center {
        text-align: center !important;
    }

    .header, .t-head, .footer, .t-foot {
        height: 105px;
        max-width: 800px;
        width: 100%;
        background: #fff;
    }

        .header > div > h3, h5 {
            margin: 0px;
        }

    #section-candidate-info > h2, h4 {
        margin: 0px;
    }

    .text-white {
        color: white !important;
    }

    .t-head, .t-foot {
        background: #fff;
    }


    .header {
        position: fixed;
        top: 0;
    }

    .footer {
        position: fixed;
        bottom: 0;
    }



    .flex-container {
        display: flex;
    }

        .flex-container > div {
            margin: 10px;
            padding: 10px;
        }

    table {
        max-width: 800px;
        width: 100%;
    }
   .content table{
   border-bottom: 1px solid black; !important;
   }
.image {
    text-align: center;
}
    .table:not(.table-bordered) td, .table:not(.table-bordered) th, .table:not(.table-bordered) tr{
    border: 1px solid black; !important;
    }

    @page {
        margin: 5mm 10mm 5mm 10mm;
    }

    @media print {
        body {
            border: 0;
        }

        thead {
            display: table-header-group;
        }

        tfoot {
            display: table-footer-group;
        }

        button {
            display: none;
        }

        body {
            margin: 0;
        }
    }
</style>
<body onload="window.print()">
    <div class="header">
        <div class="flex-container">
            <div><img src="https://cdn.onecoredevit.com/logos/core-logo-gray-text.png" height="50" /></div>
            <!--<div style="margin-top: 22px;">
                <h3 style="margin: 0px">ONE COREDEV IT INC.</h3>
                <h5>Effortless, Compliant, and Cost-Effective.</h5>
            </div>-->
        </div>

    </div>
    <div class="footer">
        <!--<h6 style="margin: 15px 0px 15px 0px " class="text-center">Copyright &#169; 2023 | Proprietary and Confidential. All rights reserved. One CoreDev IT Inc.</h6>-->
        <div style="margin: 0px 10px 0px 10px; padding: 0px 10px 0px 10px; border-top: solid #bc2026 1px">
            <h3 style="margin: 10px 0px 0px 0px;"><b>ONE COREDEV IT INC.</b></h3>

            <div style="display: flex; justify-content: space-between">
                <span><b style="color: #bc2026">Address: </b> <b>V Corporate Centre, 125 L.P Leviste Street,</b></span>
                <span style="text-align:end;"><b style="color: #bc2026;">Email: </b> <b>info@onecoredevit.com</b></span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px">
                <span><b>Salcedo, Village, Makati, 1227 Metro Manila, Philippines</b></span>
                <span style="text-align:end;"><b style="color: #bc2026;">Office Number: </b><b>+ 632 8404-0164</b> </span>
            </div>
            
            <div style="background-color: #b2b4b6; border-top-left-radius: 15px; border-top-right-radius: 15px; height: 30px; "></div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>
                    <div class="t-head">&nbsp;</div>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <div class="content">
                        <div class="page">
                            [BODYCONTENT]
                        </div>

                    </div>
                </td>
            </tr>
        </tbody>

        <tfoot>
            <tr>
                <td>
                    <div class="t-foot">&nbsp;</div>
                </td>
            </tr>
        </tfoot>
    </table>
</body>
</html>
`;

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const candidateId = params.get('id');

  const [writeUp, setWriteUps] = useState([]);
  const [filters, setFilters] = useState({
    profileOverview: true,
    professionalBackground: true,
    keyCompetencies: true,
    behavioralAssessment: true,
    others: true
  });

  const handleFilterChange = (filterName) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: !prevFilters[filterName]
    }));
  };

  const fetchWriteUp = async () => {
    try {
      const response = await infoWriteUp(candidateId);
      if (response) {
        setWriteUps(response.data.writeUp[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const generateContent = () => {
    let content = "";
    if (filters.profileOverview && writeUp.profileOverview) {
        content += `<h3>Profile Overview</h3><p>${writeUp.profileOverview}</p>`;
        
    }
    if (filters.professionalBackground && writeUp.professionalBackground) {
        content += `<h3>Professional Background</h3><p>${writeUp.professionalBackground}</p>`;
    }
    if (filters.keyCompetencies && writeUp.skills) {
        content += `<h3>Key Competencies</h3><p>${writeUp.skills}</p>`;
    }
    if (filters.behavioralAssessment && writeUp.behavioral) {
        content += `<h3>Behavioral Assessment</h3><p>${writeUp.behavioral}</p>`;
    }
    if (filters.others && writeUp.notes) {
        content += `<h3>Others</h3><p>${writeUp.notes}</p>`;
    }
    return content;
};

const handlePrint = () => {
    const content = generateContent();
    const html = printTemplate.replace("[BODYCONTENT]", content);
    const newWin = window.open('', '_blank');
    if (newWin) {
        newWin.document.write(html);
        newWin.document.close();
        newWin.onload = () => newWin.print();
    } else {
        alert("Popup Blocker is enabled! Please allow popups to print the document.");
    }
};

  
  useEffect(() => {
    fetchWriteUp();
  }, []);

  return (
    <>
      <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
        <div id="kt_app_toolbar_container" className="app-container container-fluid d-flex flex-stack">
          <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
            <a href={`viewcandidate?id=${candidateId}`} className='btn btn-sm btn-light-danger'>
              <KTIcon iconName='entrance-right' className='fs-2' />
              Go Back
            </a>
          </div>
        </div>
      </div>
      <Content>
        <div className='mb-5 mb-xl-8 px-2 py-0'>
          <div className="row fs-5 mb-5">
            <div className="col-2">
              <div className="card p-5">
                <h3 className="card-title">Document Filter</h3>
                {/* <Form>
                  <Form.Check
                    type="checkbox"
                    id="profileOverview"
                    label="Profile Overview"
                    className='my-2 text-dark'
                    checked={filters.profileOverview}
                    onChange={() => handleFilterChange('profileOverview')}
                  />
                  <Form.Check
                    type="checkbox"
                    id="professionalBackground"
                    label="Professional Background"
                    className='my-2'
                    checked={filters.professionalBackground}
                    onChange={() => handleFilterChange('professionalBackground')}
                  />
                  <Form.Check
                    type="checkbox"
                    id="keyCompetencies"
                    label="Key Competencies"
                    className='my-2'
                    checked={filters.keyCompetencies}
                    onChange={() => handleFilterChange('keyCompetencies')}
                  />
                  <Form.Check
                    type="checkbox"
                    id="behavioralAssessment"
                    label="Behavioral Assessment"
                    className='my-2'
                    checked={filters.behavioralAssessment}
                    onChange={() => handleFilterChange('behavioralAssessment')}
                  />
                  <Form.Check
                    type="checkbox"
                    id="others"
                    label="Others"
                    className='my-2'
                    checked={filters.others}
                    onChange={() => handleFilterChange('others')}
                  />
                </Form> */}
                <div className="separator border border-dark my-2"></div>

                <a onClick={handlePrint} className='btn btn-sm btn-light-danger mx-5'>
                  Print
                </a>
              </div>
            </div>
            <div className='col-10'>
              <div className="card p-5"  >
                <h3 className="card-title mb-8">Write Up Document</h3>
                <div className='d-flex justify-content-between'>
                  <p className='mb-0'>Candidate Name:</p>
                  <p className='mb-0'>Department:</p>
                </div>
                <div className='d-flex justify-content-between'>
                  <p>Position:</p>
                </div>
                <div className="separator border border-dark my-2"></div>
                {filters.profileOverview && (
                  <div className="ck-editor-wrapper mt-3">
                    <p className="card-title fw-bolder">PROFILE OVERVIEW</p>
                    <CKEditor
                     readOnly="true"
                      disabled
                      editor={ClassicEditor}
                      config={CKEditorConfig}
                      data={writeUp.profileOverview}
                    />
                  </div>
                )}
                {filters.professionalBackground && (
                  <div className="ck-editor-wrapper mt-3">
                    <p className="card-title fw-bolder">PROFESSIONAL BACKGROUND</p>
                    <CKEditor
                    readOnly="true"
                    hasFocus="false"
                      disabled
                      editor={ClassicEditor}
                      config={CKEditorConfig}
                      data={writeUp.professionalBackground}
                    />
                  </div>
                )}
                {filters.keyCompetencies && (
                  <div className="ck-editor-wrapper mt-3">
                    <p className="card-title fw-bolder">KEY COMPETENCIES</p>
                    <CKEditor
                      disabled
                      editor={ClassicEditor}
                      config={CKEditorConfig}
                      data={writeUp.skills}
                    />
                  </div>
                )}
                {filters.behavioralAssessment && (
                  <div className="ck-editor-wrapper mt-3">
                    <p className="card-title fw-bolder">BEHAVIORAL ASSESSMENT</p>
                    <CKEditor
                      disabled
                      editor={ClassicEditor}
                      config={CKEditorConfig}
                      data={writeUp.behavioral}
                    />
                  </div>
                )}
                {filters.others && (
                  <div className="ck-editor-wrapper mt-3">
                    <p className="card-title fw-bolder">OTHERS</p>
                    <CKEditor
                      disabled
                      editor={ClassicEditor}
                      config={CKEditorConfig}
                      data={writeUp.notes}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Content>
    </>
  );
};

const DocumentWriteUp = () => {
  return (
    <>
      <DocumentWriteUpPage />
    </>
  );
};

export { DocumentWriteUp };
