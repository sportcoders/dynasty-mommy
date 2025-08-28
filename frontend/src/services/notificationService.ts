export type NotifyFn = (message: string, options?: any) => void;

export let showError: NotifyFn = () => {
    throw new Error("showError is not initialized yet.");
};

export let showSuccess: NotifyFn = () => {
    throw new Error("showSuccess is not initialized yet.");
};

export const setNotificationFns = (fns: {
    showError: NotifyFn;
    showSuccess: NotifyFn;
}) => {
    showError = fns.showError;
    showSuccess = fns.showSuccess;
};
