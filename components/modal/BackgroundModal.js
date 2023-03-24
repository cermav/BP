import React, { useEffect, useState } from "react";
import ReactCrop from "react-image-crop";
import Modal from "./Modal";
import useImageCrop from "../../hooks/rectangleCropImage";
import useForm from "../../hooks/form";
import { getAuthorizationHeader } from "../../services/AuthToken";
import { useDispatch } from "react-redux";
import { updateBackground } from "../../redux/actions/pet";

const BackgroundModal = (props) => {
  const pet = props.pet ? props.pet : null;
  const hide = props.hide ? props.hide : null;
  const dispatch = useDispatch();
  const onImageSubmit = () => {
    onCropComplete();
  };
  const { crop, croppedImage, onImageLoaded, onCropChange, onCropComplete } = useImageCrop({
    defCrop: { unit: "%", aspect: 3 / 1 },
  });
  const [src, setSrc] = useState(null);

  const { serverErrors } = useForm();
  useEffect(() => {
    if (croppedImage) {
      const fetchRegistration = async () => {
        try {
          const response = await fetch(process.env.apiURL + "pets/" + pet.id + "/background", {
            method: "put",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: getAuthorizationHeader(),
            },
            body: JSON.stringify({ background: croppedImage }),
          });
          const data = await response.json();
          if (response.status === 200) {
            // created
            dispatch(updateBackground(data));
            hide();
          } else {
            // data error
            serverErrors(data);
            console.log("Některé položky nejsou validní, prosím zkontrolujte vaše data.");
          }
        } catch (err) {
          console.log("Nastala chyba při ukládání: " + err);
        }
      };
      fetchRegistration();
    }
  }, [croppedImage]);
  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setSrc(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  return (
    <Modal title="Pozadí stránky" onClose={hide}>
      <div className="modalContent">
        <p>
          <label htmlFor="file-upload" className="custom-file-upload">
            <span className="icon-upload"></span> &nbsp;Nahrát obrázek
          </label>
        </p>
        <input type="file" id="file-upload" onChange={onSelectFile} />
        {src && (
          <ReactCrop
            src={src}
            crop={crop}
            onImageLoaded={onImageLoaded}
            onChange={onCropChange}
            style={{ marginTop: "2rem" }}
          />
        )}
      </div>
      <button onClick={onImageSubmit} className="button white">
        Uložit
      </button>
    </Modal>
  );
};
export default BackgroundModal;
