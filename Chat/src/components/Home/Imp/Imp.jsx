import { useState } from 'react';
import Sidebar from '../../ui/Sidebar';
import Chat from '../Chat/Chat';

function Imp() {
      const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar expanded={expanded} setExpanded={setExpanded} />

      {/* Main Chat Container */}
      <div
        className={`transition-all duration-300 flex-1 ${
          expanded ? "m-auto" : "m-auto"
        }`}
      >
        <Chat />
      </div>
    </div>
    </div>
  )
}

export default Imp
