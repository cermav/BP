import React from "react";
import { withRedux } from "../components/hoc/withRedux";
import ResetPasswordForm from "../components/auth/ResetPasswordForm";
import Layout from "../layouts/Loggedout";

const ResetPassword = () => {

    return (
        <Layout bodyClass="profile" registrationPromo={false}>
            <div className="text-document">
                <ResetPasswordForm />
            </div>
        </Layout>
    );
};
export default withRedux(ResetPassword);
