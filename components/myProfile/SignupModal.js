import React, { useState } from "react";
import ReactCrop from "react-image-crop";
import Modal from "../modal/Modal";

const SignupModal = ({ crop, onImageLoaded, onCropComplete, onCropChange, hide, save }) => {
    const [src, setSrc] = useState(null);
    const onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener("load", () => setSrc(reader.result));
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const saveAndClose = () => {
        save();
        hide();
    };

    return (
        <Modal title="Profilový obrázek" onClose={hide}>
            <div className="modalContent">
                <p>
                    <label for="file-upload" className="custom-file-upload">
                        <span className="icon-upload"></span> &nbsp;Nahrát obrázek
                    </label>
                </p>
                <input type="file" id="file-upload" onChange={onSelectFile} />
                {src && <ReactCrop src={src} crop={crop} onImageLoaded={onImageLoaded} onChange={onCropChange} style={{ marginTop: "2rem" }} />}
            </div>
            <button onClick={saveAndClose} className="button white">
                Uložit
            </button>
        </Modal>
    );
};
export default SignupModal;
