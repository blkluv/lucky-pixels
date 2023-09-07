import Resizer from "react-image-file-resizer";

export const resizeImg = (img) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      img,
      50,
      50,
      "WEBP",
      50,
      0,
      (uri) => {
        resolve(uri);
      },
      "base64"
    );
  });
