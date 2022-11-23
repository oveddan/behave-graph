import { useState } from 'react';
import { ClearModal } from './ClearModal';
import { HelpModal } from './HelpModal';
import { faPlay, faPause, faQuestion, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Controls, ControlButton } from 'reactflow';

// const ControlButton = ({ children, title, onClick }: { title: string; children: JSX.Element; onClick: () => void }) => (
//   <button
//     type="button"
//     onClick={onClick}
//     className="text-gray-700 border border-gray-700 hover:bg-gray-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-gray-300 dark:border-gray-500 dark:text-gray-500 dark:hover:text-white dark:focus:ring-gray-800'"
//   >
//     {children}
//   </button>
// );

const CustomControls = ({
  toggleRun,
  running,
  additionalControls = null,
}: {
  toggleRun: () => void;
  running: boolean;
  additionalControls?: JSX.Element | null;
}) => {
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [clearModalOpen, setClearModalOpen] = useState(false);

  return (
    <>
      <Controls className="bg-white">
        {additionalControls}
        <ControlButton title="Help" onClick={() => setHelpModalOpen(true)} className="align-middle">
          <FontAwesomeIcon icon={faQuestion} />
        </ControlButton>
        <ControlButton title="Clear" onClick={() => setClearModalOpen(true)}>
          <FontAwesomeIcon icon={faTrash} />
        </ControlButton>
        <ControlButton title="Run" onClick={() => toggleRun()}>
          <FontAwesomeIcon icon={running ? faPause : faPlay} />
        </ControlButton>
      </Controls>
      <HelpModal open={helpModalOpen} onClose={() => setHelpModalOpen(false)} />
      <ClearModal open={clearModalOpen} onClose={() => setClearModalOpen(false)} />
    </>
  );
};

export default CustomControls;
