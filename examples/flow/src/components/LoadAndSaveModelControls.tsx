import { useState } from 'react';
import { faDownload, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { LoadModal } from './LoadModal';
import { SaveModal } from './SaveModal';
import { ControlButton } from 'reactflow';
import { GraphJSON } from '@behave-graph/core';


const LoadAndSaveModelControls = ({
  graphJson,
  handleGraphJsonLoaded,
  setModelFile,
}: {
  graphJson: GraphJSON|undefined;
  handleGraphJsonLoaded: (value: GraphJSON) => void;
  setModelFile: (file: File|undefined)=> void; 
})  => {
  const [loadModalOpen, setLoadModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  return <>
        <ControlButton title="Load" onClick={() => setLoadModalOpen(true)}>
          <FontAwesomeIcon icon={faUpload} />
        </ControlButton>
        <ControlButton title="Save" onClick={() => setSaveModalOpen(true)}>
          <FontAwesomeIcon icon={faDownload} />
        </ControlButton>
      <LoadModal
        open={loadModalOpen}
        onClose={() => setLoadModalOpen(false)}
        handleGraphJsonLoaded={handleGraphJsonLoaded}
        setModelFile={setModelFile}
      />
      <SaveModal open={saveModalOpen} onClose={() => setSaveModalOpen(false)} graphJson={graphJson} />
  </>

}

export default LoadAndSaveModelControls;