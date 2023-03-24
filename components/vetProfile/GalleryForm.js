import React, { useState } from 'react';
import { withNotie } from 'react-notie'
import PropTypes from 'prop-types'
import unfetch from 'isomorphic-unfetch';
import { getAuthorizationHeader } from '../../services/AuthToken';

import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app

import ImageUploader from '../imageUpload/ImageUpload';
import Submit from '../form/Submit';

import { withRedux } from '../hoc/withRedux';

const GalleryForm = ({ userId, doctorGallery, reloadDoctor, notie }) => {

  const [activeIndex, setActiveIndex] = useState(0)
  const [pictures, setPictures] = useState([])
  const [pending, setPending] = useState(false)

  const onDrop = (pictureFiles, pictureDataURLs) => {
    let store = []
    pictureDataURLs.map((data) => {
      let parts = data.split(';')
      store.push({
        'name': parts[1].replace("name=", ""),
        'type': parts[0].replace("data:", ""),
        'content': parts[2].replace("base64,", "")
      })
    })
    setPictures(store)
  }

  const submitForm = async (event) => {
    event.preventDefault();
    /* send data to API */
    try {
      const response = await unfetch(process.env.apiURL + "gallery/" + userId, {
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: getAuthorizationHeader()
        },
        body: JSON.stringify(pictures)
      });
      const data = await response.json();
      if (response.status === 200) {
        // updated
        notie.success('Data byla aktualizována')
        setPending(false)
      } else {
        notie.error('Nastala chyba při ukládání: ' + data.message)
      }
    } catch (err) {
      notie.error('Nastala chyba při ukládání: ' + err)
    }
    // clear images from uploader
    ImageUploader.pictures = [];
    reloadDoctor()
  }

  const remove = async (id) => {
    /* send data to API */
    try {
      const response = await unfetch(process.env.apiURL + "gallery/" + id, {
        method: "delete",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: getAuthorizationHeader()
        }
      });
      const data = await response.json();
      if (response.status === 200) {
        // updated
        notie.success('Obrázek byl smazán')
        setPending(false)
      } else {
        notie.error('Nastala chyba při mazání: ' + data.message)
      }
    } catch (err) {
      notie.error('Nastala chyba při mazání: ' + err)
    }
    reloadDoctor()
  }


  return (
    <div className="profileGallery" >
      <form onSubmit={submitForm} noValidate autoComplete="off">

        <div className="imageUploader">
          <ImageUploader
            name="picture"
            withIcon={true}
            withPreview={true}
            buttonText='Choose images'
            onChange={onDrop}
            imgExtension={['.jpg', '.gif', '.png', '.gif']}
            maxFileSize={5242880}
          />
        </div>
        <Submit name="save" id="vetChange" value="Uložit" />
      </form>

      <div className="profileGalleryContainer" >

        <h2>Nahrané obrázky</h2>

        <div className="profileGallery">
          {doctorGallery && doctorGallery.map((image, i) =>
            <figure className="profileGallery__figure" key={image.id}>
              <img className="profileGallery__img" src={image.path} />
              <a onClick={() => { remove(image.id) }} className="button">Delete</a>
            </figure>

          )}
        </div>

      </div>

    </div>
  );

}

GalleryForm.propTypes = {
  userId: PropTypes.number.isRequired,
  doctorGallery: PropTypes.array.isRequired,
}

export default withNotie(withRedux(GalleryForm))