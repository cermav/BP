import React from "react";

import Layout from "../../layouts/Loggedout";

import SignupForm from "../../components/myProfile/SignupForm";

import { withRedux } from "../../components/hoc/withRedux";

const Signup = () => {
    return (
        <Layout bodyClass="profile" registrationPromo={false}>
            <div className="text-document">
                <SignupForm />
            </div>
        </Layout>
    );
};
export default withRedux(Signup);
