import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../components/ui/Button';
import { AlertTriangle, Info } from 'lucide-react';
import { DialogOptions } from '../types';
import { cn } from '../lib/utils';

interface DialogContextType {
  confirm: (options: DialogOptions) => Promise<boolean>;
  alert: (options: Omit<DialogOptions, 'cancelText' | 'variant'>) => Promise<void>;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

interface DialogState extends DialogOptions {
  isOpen: boolean;
  type: 'confirm' | 'alert';
  onConfirm: () => void;
  onCancel: () => void;
}

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dialogState, setDialogState] = useState<DialogState | null>(null);
  
  // We use refs to store the promise resolvers so they persist across renders
  const resolveRef = useRef<(value: any) => void>(() => {});

  const closeDialog = useCallback(() => {
    setDialogState((prev) => (prev ? { ...prev, isOpen: false } : null));
    // Small delay to allow animation to finish before removing from DOM (optional enhancement, skipping for simplicity)
    setTimeout(() => setDialogState(null), 150);
  }, []);

  const confirm = useCallback((options: DialogOptions) => {
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
      setDialogState({
        ...options,
        isOpen: true,
        type: 'confirm',
        onConfirm: () => {
          resolveRef.current(true);
          closeDialog();
        },
        onCancel: () => {
          resolveRef.current(false);
          closeDialog();
        },
      });
    });
  }, [closeDialog]);

  const alert = useCallback((options: Omit<DialogOptions, 'cancelText' | 'variant'>) => {
    return new Promise<void>((resolve) => {
      resolveRef.current = resolve;
      setDialogState({
        ...options,
        isOpen: true,
        type: 'alert',
        onConfirm: () => {
          resolveRef.current(undefined);
          closeDialog();
        },
        onCancel: () => {
          // Alert can't really be cancelled, but clicking outside or ESC acts as confirm
          resolveRef.current(undefined);
          closeDialog();
        },
      });
    });
  }, [closeDialog]);

  return (
    <DialogContext.Provider value={{ confirm, alert }}>
      {children}
      {dialogState && (
        <DialogContainer state={dialogState} onClose={dialogState.onCancel} />
      )}
    </DialogContext.Provider>
  );
};

const DialogContainer: React.FC<{ state: DialogState; onClose: () => void }> = ({ state, onClose }) => {
  // Simple trap focus could be added here
  
  const isDanger = state.variant === 'danger';

  return createPortal(
    <div className="fixed inset-0 z-[60] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Panel */}
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className={cn(
                "mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10",
                isDanger ? "bg-red-100" : "bg-blue-100"
              )}>
                {isDanger ? (
                  <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
                ) : (
                  <Info className="h-6 w-6 text-blue-600" aria-hidden="true" />
                )}
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                <h3 className="text-base font-semibold leading-6 text-slate-900" id="modal-title">
                  {state.title}
                </h3>
                {state.description && (
                  <div className="mt-2">
                    <p className="text-sm text-slate-500">{state.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="bg-slate-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <Button
              variant={isDanger ? 'danger' : 'primary'}
              onClick={state.onConfirm}
              className="w-full sm:ml-3 sm:w-auto"
            >
              {state.confirmText || 'Confirm'}
            </Button>
            {state.type === 'confirm' && (
              <Button
                variant="secondary"
                onClick={state.onCancel}
                className="mt-3 w-full sm:mt-0 sm:w-auto"
              >
                {state.cancelText || 'Cancel'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) throw new Error('useDialog must be used within a DialogProvider');
  return context;
};
