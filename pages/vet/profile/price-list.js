import React, { useEffect, useState } from "react";
import { withNotie } from 'react-notie'
import unfetch from 'isomorphic-unfetch';

import { withVetRoute } from "../../../components/hoc/withVetRoute";
import { withRedux } from "../../../components/hoc/withRedux";
import Layout from "../../../layouts/Loggedin";
import Loader from "../../../components/Loader";
import Tabs from "../../../components/vetProfile/Tabs";
import PriceListForm from "../../../components/vetProfile/PriceListForm";
import { getUserId } from "../../../services/AuthToken";

const PriceList = (notie) => {

    const [doctor, setDoctor] = useState(null)
    const [services, setServices] = useState(null)
    const [pending, setPending] = useState(true)

    const loadDoctor = () => {
        return unfetch(`${process.env.apiURL}doctors/${getUserId()}`)
            .then(response => response.json())
            .catch(error => {
                notie.error('Nastala chyba při nahrávání' + error);
            });
    }

    const loadServices = async () => {
        return unfetch(`${process.env.apiURL}services`)
            .then(response => response.json())
            .catch(error => {
                notie.error('Nastala chyba při nahrávání' + error);
            });
    }

    const loadData = async () => {
        setPending(true)
        await loadDoctor().then(response => {
            setDoctor(response.data)
        })
        await loadServices().then(response => {
            setServices(response)
        })
    }

    useEffect(() => {
        loadData()
    }, [])
    useEffect(() => {
        if (doctor !== null && services !== null) {
            setPending(false)
        }
    }, [doctor, services])

    return (
        <Layout bodyClass="profile" checkCurrentDoctor={true}>
            <div className="profileWrapper">
                {pending ? (
                    <Loader />
                ) : (
                        <React.Fragment>
                            <h1>Můj profil</h1>
                            <Tabs activeTab={2} />
                            <PriceListForm userId={doctor.id} services={services} doctorServices={doctor.services} />
                        </React.Fragment>
                    )}
            </div>
        </Layout>
    );
};

export default withRedux(withVetRoute(withNotie(PriceList)));
