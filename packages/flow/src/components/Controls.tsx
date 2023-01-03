import { useState } from "react";
import { ClearModal } from "./modals/ClearModal";
import { HelpModal } from "./modals/HelpModal";
import {
  faDownload,
  faPlay,
  faPause,
  faQuestion,
  faTrash,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { LoadModal } from './modals/LoadModal';
import { SaveModal } from './modals/SaveModal';
import { useReactFlow, Controls, ControlButton } from "reactflow";
import { GraphJSON } from "@behave-graph/core";

const CustomControls = ({
  playing,
  togglePlay,
  setBehaviorGraph
}: {
  playing: boolean;
  togglePlay: () => void;
  setBehaviorGraph: (value: GraphJSON) => void;
}) => {
  const [loadModalOpen, setLoadModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const instance = useReactFlow();

  return (
    <>
      <Controls>
        <ControlButton title="Help" onClick={() => setHelpModalOpen(true)}>
          <FontAwesomeIcon icon={faQuestion} />
        </ControlButton>
        <ControlButton title="Load" onClick={() => setLoadModalOpen(true)}>
          <FontAwesomeIcon icon={faUpload} />
        </ControlButton>
        <ControlButton title="Save" onClick={() => setSaveModalOpen(true)}>
          <FontAwesomeIcon icon={faDownload} />
        </ControlButton>
        <ControlButton title="Clear" onClick={() => setClearModalOpen(true)}>
          <FontAwesomeIcon icon={faTrash} />
        </ControlButton>
        <ControlButton title="Run" onClick={togglePlay}>
          <FontAwesomeIcon icon={playing ? faPause : faPlay} />
        </ControlButton>
      </Controls>
      <LoadModal open={loadModalOpen} onClose={() => setLoadModalOpen(false)} setBehaviorGraph={setBehaviorGraph} />
      <SaveModal open={saveModalOpen} onClose={() => setSaveModalOpen(false)} />
      <HelpModal open={helpModalOpen} onClose={() => setHelpModalOpen(false)} />
      <ClearModal
        open={clearModalOpen}
        onClose={() => setClearModalOpen(false)}
      />
    </>
  );
};

export default CustomControls;
