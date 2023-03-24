import React, { Component } from "react";
import Router from "next/router";
import nextCookie from "next-cookies";
import { isVet, isAuthorized, isAdmin } from "../../services/AuthToken";

export function withProfileRedirect(WrappedComponent) {
  return class extends Component {
    static async getInitialProps(ctx) {
      const { drmouseToken } = nextCookie(ctx);

      if (ctx.req && isAuthorized(drmouseToken)) {
        ctx.res.writeHead(302, {
          Location: isAdmin(drmouseToken) ? "/admin/vets" : isVet(drmouseToken) ? "/vet/profile" : "/profil",
        });
        ctx.res.end();
        return;
      }
      if (!ctx.req && isAuthorized()) {
        if (isVet()) Router.push("/vet/profile");
        else if (isAdmin()) Router.push("/admin/vets");
        else Router.push("/profil");
      }
      return drmouseToken || {};
    }

    render() {
      return <WrappedComponent />;
    }
  };
}
