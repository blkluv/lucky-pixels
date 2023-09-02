"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export const closeModal = () =>
  (document.getElementById("image_preview_modal") as HTMLFormElement)?.close();
export const showModal = () =>
  (
    document.getElementById("image_preview_modal") as HTMLFormElement
  )?.showModal();

function ImagePreviewModal({ slicedImages, amountX, amountY, setIsPreview }) {
  useEffect(() => {
    showModal();
  }, []);

  return (
    <>
      <dialog id="image_preview_modal" className="modal">
        <div className="modal-box">
          <div className="m-5">
            <h3 className="text-lg font-bold">
              Your sliced {amountX}x{amountY} image
            </h3>
            <div className="flex flex-col justify-center p-3">
              {slicedImages.length > 0 &&
                [...Array(amountY)].map((a, x) => {
                  return (
                    <div key={x} className="flex justify-center ">
                      {[...Array(amountX)].map((b, y) => {
                        const imgPath = slicedImages[x * amountX + y];
                        return (
                          <div
                            key={x * amountY + y}
                            className={`relative flex items-center justify-center`}
                            style={{
                              height: 25,
                              width: 25,
                              marginBottom: 1,
                              marginRight: 1,
                            }}
                          >
                            {imgPath && (
                              <Image
                                src={imgPath}
                                fill
                                quality={20}
                                alt="Pixel picture"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <form
          method="dialog"
          className="modal-backdrop"
          onClick={() => setIsPreview(false)}
        >
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}

export default ImagePreviewModal;
