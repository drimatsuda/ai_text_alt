
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // result is a data URL: "data:image/jpeg;base64,..."
      // We need to extract just the base64 part.
      const result = reader.result as string;
      const base64String = result.split(',')[1];
      if (base64String) {
        resolve(base64String);
      } else {
        reject(new Error("Não foi possível converter o arquivo para Base64."));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};
