import React, { Component } from "react";
import Router from 'next/router';
import nextCookie from 'next-cookies'
import { isAuthorized } from '../../services/AuthToken';

export function withUserRoute(WrappedComponent) {
  return class extends Component {

    static async getInitialProps(ctx) {
      const { drmouseToken } = nextCookie(ctx);
      if (ctx.req && !isAuthorized(drmouseToken)) {
        ctx.res.writeHead(302, {
          Location: "/login",
        });
        ctx.res.end();
        return;
      }
      if (!ctx.req && !isAuthorized()) {
        Router.push('/login');
      }
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