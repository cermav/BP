import React, { useEffect, useState } from "react";
import { withNotie } from 'react-notie'
import unfetch from 'isomorphic-unfetch';

import { withVetRoute } from "../../../components/hoc/withVetRoute";
import { withRedux } from "../../../components/hoc/withRedux";
import Layout from "../../../layouts/Loggedin";
import Loader from "../../../components/Loader";
import Tabs from "../../../components/vetProfile/Tabs";
import PropertiesForm from "../../../components/vetProfile/PropertiesForm";
import { getUserId } from "../../../services/AuthToken";

const Specialization = (notie) => {
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
        setPending(false)
    }

    useEffect(() => {
        loadDoctor()
    }, [])

    return (
        <Layout bodyClass="profile" checkCurrentDoctor={true}>
            <div className="profileWrapper">
                {pending ? (
                    <Loader />
                ) : (
                        <React.Fragment>
                            <h1>Můj profil</h1>
                            <Tabs activeTab={5} />
                            <PropertiesForm propertyType="specialization" propertyId={3} userId={doctor.id} property={doctor.properties.specialization} title="Specializace" />
                        </React.Fragment>
                    )}
            </div>
        </Layout>
    );
};

export default withRedux(withVetRoute(withNotie(Specialization)));
