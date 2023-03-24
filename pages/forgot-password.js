import React from "react";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";
import Layout from "../layouts/Loggedout";

import { withProfileRedirect } from "../components/hoc/withProfileRedirect";

import { withRedux } from "../components/hoc/withRedux";

const ForgotPassword = () => {
    return (
        <Layout bodyClass="profile" registrationPromo={false}>
            <div className="text-document">
                <ForgotPasswordForm />
            </div>
        </Layout>
    );
};
export default withRedux(withProfileRedirect(ForgotPassword));
