import React, { Component } from "react";
import Router from 'next/router';
import nextCookie from 'next-cookies'
import { isVet, isAdmin, isAuthorized } from '../../services/AuthToken';

export function withVetRoute(WrappedComponent) {
  return class extends Component {

    static async getInitialProps(ctx) {

      const { drmouseToken } = nextCookie(ctx);

      // stay on page if is admin and current doctor is selected
      if (isAuthorized(drmouseToken) && isAdmin(drmouseToken)) {
        return { drmouseToken };
      }

      // SERVER Generating - redirect to login page if not authorized
      if ((ctx.req && !isAuthorized(drmouseToken)) || (ctx.req && isAuthorized(drmouseToken) && !isVet(drmouseToken))) {
        ctx.res.writeHead(302, {
          Location: "/login",
        });
        ctx.res.end();
        return;
      }

      // Client Generating - redirect to login page if not authorized
      if ((!ctx.req && !isAuthorized()) || (!ctx.req && isAuthorized() && !isVet())) {
        Router.push('/login');
      }

      // stay on page
      return { drmouseToken };
    }

    /* Synchornized logout from different tabs */

    //Add event listener when a restricted Page Component mounts
    componentDidMount() {
      window.addEventListener('storage', this.syncLogout)
    }
    // event listener when the Component unmount and
    // delete all data
    componentWillUnmount() {
      window.removeEventListener('storage', this.syncLogout)
      window.localStorage.removeItem('logout')
    }
    syncLogout = (event) => {
      if (event.key === 'logout') {
        Router.push('/login')
      }
    }

    render() {
      return <WrappedComponent />;
    }
  };
}