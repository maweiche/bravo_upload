'use client';
import { useState } from 'react';
import { AppHero } from '../ui/ui-layout';
import { FileUploadUiModal, DataUploadUiModal } from '../upload/upload-ui';


export default function DashboardFeature() {
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  const [showDataUploadModal, setShowDataUploadModal] = useState(false);

  return (
    <div className="flex flex-col mt-6 items-center">
      <img className="h-12 md:h-6" alt="Logo" src="/bravo_upload_logo.svg" style={{ height: '20rem'}}/>
      <AppHero title="bravo upload" subtitle="Say Baby, how's about we upload to Irys." />
      <div className="max-w-xl mx-auto py-6 sm:px-6 lg:px-8 text-center">
        <div className="space-x-2">
          <FileUploadUiModal hideModal={() => {setShowFileUploadModal(false)}} show={showFileUploadModal} />
          <DataUploadUiModal hideModal={() => {setShowDataUploadModal(false)}} show={showDataUploadModal} />

          <button
            onClick={() => setShowFileUploadModal(true)}
            className="btn btn-primary"
          >
            Upload File
          </button>
          <button
            onClick={() => setShowDataUploadModal(true)}
            className="btn btn-primary"
          >
            Upload Data
          </button>
        </div>
      </div>
    </div>
  );
}
