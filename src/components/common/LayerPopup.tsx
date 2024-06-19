import React, { Fragment, InputHTMLAttributes, PropsWithChildren } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";

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
      <Dialog className="relative z-[500]" onClose={onClose}>
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
                    className={`flex flex-col overflow-y-scroll bg-[#ffffff] shadow-xl pt-6 ${
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

const LayerPopupHeader = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="flex justify-between items-center px-6 sm:px-8 pl-14">
      {children}
    </div>
  );
};

const LayerPopupTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <DialogTitle className="text-base font-semibold leading-6 m-auto">
      {children}
    </DialogTitle>
  );
};

const LayerPopupBody = ({ children }: { children?: React.ReactNode }) => {
  return <div className="relative mt-6 flex-1 px-6 sm:px-8 ">{children}</div>;
};

const LayerPopup = Object.assign(LayerPopupRoot, {
  Header: LayerPopupHeader,
  Title: LayerPopupTitle,
  Body: LayerPopupBody,
});

export default LayerPopup;

const CloseButton = (props: InputHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    type="button"
    className="absolute left-6 sm:left-8 top-5 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
  >
    <Image width="24" height="24" src="/icons/icon-close.svg" alt="close" />
  </button>
);
