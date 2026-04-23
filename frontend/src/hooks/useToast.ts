import Toast from 'react-native-toast-message';

export const useToast = () => {
  const showSuccess = (message: string, title?: string) => {
    Toast.show({
      type: 'success',
      text1: title ?? 'Success',
      text2: message,
      visibilityTime: 3000,
    });
  };

  const showError = (message: string, title?: string) => {
    Toast.show({
      type: 'error',
      text1: title ?? 'Error',
      text2: message,
      visibilityTime: 4000,
    });
  };

  const showInfo = (message: string, title?: string) => {
    Toast.show({
      type: 'info',
      text1: title ?? 'Info',
      text2: message,
      visibilityTime: 3000,
    });
  };

  const showWarning = (message: string, title?: string) => {
    Toast.show({
      type: 'error',
      text1: title ?? 'Warning',
      text2: message,
      visibilityTime: 3500,
    });
  };

  const hide = () => {
    Toast.hide();
  };

  return { showSuccess, showError, showInfo, showWarning, hide };
};
