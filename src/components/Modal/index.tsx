import { XIcon } from "@heroicons/react/outline";
import * as ReactModal from "react-modal";

ReactModal.setAppElement("#__next");

const Modal = ({ children, isOpen, onClose }) => (
  <ReactModal
    isOpen={isOpen}
    onRequestClose={onClose}
    overlayClassName="fixed z-20 top-0 left-0 right-0 bottom-0 bg-black bg-opacity-20"
    className="absolute bg-white md:border md:border-black z-30 md:min-w-80 md:m-0 md:top-1/3 md:left-1/2 md:transform md:-translate-y-1/2 md:-translate-x-1/2 flex justify-center h-screen w-full md:w-auto md:h-auto"
  >
    <div className="absolute right-4 top-4 z-40">
      <button onClick={onClose} className="p-1">
        <XIcon className="h-4 w-4 heroicon-sw-2" />
      </button>
    </div>
    {children}
  </ReactModal>
);

export default Modal;
