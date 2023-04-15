import {getAuthorizationHeader} from "../services/AuthToken";
import {useEffect, useState} from "react";
import Layout from "../layouts/Loggedin";
import {withRedux} from "../components/hoc/withRedux";
import {withUserRoute} from "../components/hoc/withUserRoute";
import {formatDate} from "@fullcalendar/core";
import {formatTimestamp} from "../helpers/formatTimestamp";

const Records = () => {
    const [records, setRecords] = useState([]);

    useEffect(() => {
        const getRecords = async () => {
            const response = await fetch(process.env.apiURL + "record/list", {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: getAuthorizationHeader(),
                },
            });

            const result = await response.json();
            setRecords(result);
        }
        getRecords();
    }, [])

    return <Layout bodyClass="records" registrationPromo={false}>
        <div className="recordsContainer">
            <h1>Vaše záznamy z vyšetření</h1>
            <table style={{marginTop: "2rem", width: "60vw"}}>
                {/*table header*/}
                <tr style={{fontWeight: "bold"}}>
                    <td>
                        Název
                    </td>
                    <td>
                        Text
                    </td>
                    <td>
                        Datum
                    </td>
                </tr>
                {records && records.map(record =>
                    <tr>
                        <td>{record.description}</td>
                        <td>{record.medical_record}</td>
                        <td>{formatTimestamp(record.date)}</td>
                    </tr>
                )}
            </table>
        </div>
    </Layout>
    }

export default withRedux(withUserRoute(Records));

