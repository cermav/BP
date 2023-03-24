import React, { useEffect, useState } from "react";
import { withRouter } from "next/router";
import Link from "next/link";
import { withRedux } from "../../components/hoc/withRedux";

import Layout from "../../layouts/Loggedout";

const Verify = props => {
    const { router } = props;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (router.query.link != null) {
            if (verifyEmail(atob(router.query.link))) {
                setLoading(false);
            } else {
                setError("Email se nepodařilo ověřit");
            }
        } else {
            setError("Chybné vstupní parametry");
        }
    }, []);

    /* send data to API */
    const verifyEmail = async remoteLink => {
        try {
            const response = await fetch(remoteLink, {
                method: "get",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            console.log(data);

            if (response.status === 200) {
                // created
                return true;
            }
        } catch (err) {
            console.log(err);
        }

        return false;
    };

    return (
        <Layout bodyClass="verify" registrationPromo={false}>
            <div className="text-document">
                <h2>Ověření vašeho emailu</h2>

                {loading ? (
                    <p>Probíhá ověření vašeho požadavku...</p>
                ) : (
                    <p>
                        Ověření vašeho požadavku bylo dokončeno. Pokračujte prosím na{" "}
                        <Link href="/login">
                            <a>přihlášení</a>
                        </Link>
                        .
                    </p>
                )}

                {error && <div className="message-error">{error}</div>}
            </div>
        </Layout>
    );
};
export default withRedux(withRouter(Verify));
