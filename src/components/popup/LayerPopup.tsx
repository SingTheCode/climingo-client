import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import Image from "next/image";
import { Fragment, InputHTMLAttributes, PropsWithChildren } from "react";

interface LayerPopupRootProps {
  open: boolean;
  onClose: () => void;
  hideCloseButton?: boolean;
  fullscreen?: boolean;
}

const LayerPopupRoot = ({
  open,
  onClose,
  hideCloseButton = false,
  fullscreen = false,
  children,
}: PropsWithChildren<LayerPopupRootProps>) => {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog className="relative z-overlay" onClose={onClose}>
        {/** overlay */}
        <TransitionChild
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-shadow-darker/75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div
              className={`pointer-events-none fixed inset-x-0 bottom-0 flex max-w-full ${
                fullscreen ? "top-0" : ""
              }`}
            >
              <TransitionChild
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-y-full"
                enterTo="translate-y-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-y-0"
                leaveTo="translate-y-full"
              >
                <DialogPanel className="pointer-events-auto relative w-screen">
                  <div
                    className={`w-full flex flex-col overflow-y-scroll bg-white shadow-xl pt-6 ${
                      fullscreen ? "h-full" : "rounded-t-[2rem]"
                    }`}
                  >
                    {!hideCloseButton && <CloseButton onClick={onClose} />}
                    {children}
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const LayerPopupHeader = ({
  title,
  children,
}: {
  title?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="absolute top-0 flex items-center justify-end min-h-[4rem] w-full bg-white z-10">
      {title && (
        <DialogTitle className="absolute left-1/2 -translate-x-1/2 text-center text-base font-medium leading-6 w-[60%] line-clamp-2 break-keep pt-6">
          {title}
        </DialogTitle>
      )}
      {children}
    </div>
  );
};

const LayerPopupBody = ({ children }: { children?: React.ReactNode }) => {
  return <div className="relative mt-[2rem] flex-1 px-8">{children}</div>;
};

const LayerPopup = Object.assign(LayerPopupRoot, {
  Header: LayerPopupHeader,
  Body: LayerPopupBody,
});

export default LayerPopup;

const CloseButton = (props: InputHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    type="button"
    className="absolute left-6 top-6 rounded-md focus:outline-none focus:ring-2 focus:ring-white z-20"
  >
    <Image width="24" height="24" src="/icons/icon-close.svg" alt="close" />
  </button>
);
