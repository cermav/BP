import React, { useEffect, useState } from "react";
import { withNotie } from 'react-notie'
import unfetch from 'isomorphic-unfetch';

import { withVetRoute } from "../../../components/hoc/withVetRoute";
import { withRedux } from "../../../components/hoc/withRedux";
import Layout from "../../../layouts/Loggedin";
import Loader from "../../../components/Loader";
import Tabs from "../../../components/vetProfile/Tabs";
import GalleryForm from "../../../components/vetProfile/GalleryForm";
import { getUserId } from "../../../services/AuthToken";

const Gallery = (notie) => {

    const [doctor, setDoctor] = useState(null)
    const [pending, setPending] = useState(true)

    const loadDoctor = async () => {
        setPending(true)
        // initialize doctor
        const response = await unfetch(`${process.env.apiURL}doctors/${getUserId()}`)
        const jsonResponse = await response.json();
        if (response.status === 200) {
            setDoctor(jsonResponse.data)
        } else {
            notie.error('Nastala chyba při nahrávání')
        }
    }

    const reloadDoctor = () => {
        loadDoctor()
    }

    useEffect(() => {
        loadDoctor()
    }, [])
    useEffect(() => {
        if (doctor !== null) {
            setPending(false)
        }
    }, [doctor])


    return (
        <Layout bodyClass="profile" checkCurrentDoctor={true}>
            <div className="profileWrapper">
                {pending ? (
                    <Loader />
                ) : (
                        <React.Fragment>
                            <h1>Můj profil</h1>
                            <Tabs activeTab={7} />
                            <GalleryForm userId={doctor.id} doctorGallery={doctor.gallery} reloadDoctor={reloadDoctor} />
                        </React.Fragment>
                    )}
            </div>
        </Layout>
    );
};

export default withRedux(withVetRoute(withNotie(Gallery)));
