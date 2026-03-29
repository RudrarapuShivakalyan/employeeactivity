import { toast } from "sonner";

export const showToast = {
  success: (message, options = {}) => {
    toast.success(message, {
      duration: 3000,
      position: "top-right",
      ...options,
    });
  },

  error: (message, options = {}) => {
    toast.error(message, {
      duration: 4000,
      position: "top-right",
      ...options,
    });
  },

  warning: (message, options = {}) => {
    toast.warning(message, {
      duration: 3000,
      position: "top-right",
      ...options,
    });
  },

  info: (message, options = {}) => {
    toast.info(message, {
      duration: 3000,
      position: "top-right",
      ...options,
    });
  },

  loading: (message, options = {}) => {
    return toast.loading(message, options);
  },

  dismiss: (id) => {
    toast.dismiss(id);
  },

  promise: (promise, messages, options = {}) => {
    return toast.promise(promise, messages, options);
  },
};

export default showToast;
