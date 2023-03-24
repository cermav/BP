import { withRouter } from "next/router";
import Link from "next/link";
import React, { Children } from "react";

const ActiveLink = ({ router, children, ...props }) => {
  const child = Children.only(children);
  const asPath = props.aspath ? props.aspath : undefined;
  let className = child.props.className || "";
  if (router.pathname === props.href || (router.asPath === props.href && props.activeClassName) || (router?.asPath?.includes(asPath)))  {
    className = `${className} ${props.activeClassName}`.trim();
  }
  delete props.activeClassName;

  return <Link {...props}>{React.cloneElement(child, { className })}</Link>;
};

export default withRouter(ActiveLink);
