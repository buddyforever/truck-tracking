import React from "react";
import Aux from "../../../../../../hoc/_Aux";
import NavCollapse from "./../NavCollapse";
import NavItem from "./../NavItem";

const navGroup = (props) => {
  let navItems = "";
  if (props.group.children) {
    const groups = props.group.children;
    navItems = Object.keys(groups)
      .filter(
        (item) =>
          props.authUser.type === 0 ||
          props.authUser.type === 1 ||
          groups[item].visible.includes(parseInt(props.authUser.type))
      )
      .map((item) => {
        item = groups[item];
        switch (item.type) {
          case "collapse":
            return (
              <NavCollapse
                key={item.id}
                collapse={item}
                type="main"
                authUser={props.authUser}
              />
            );
          case "item":
            return <NavItem layout={props.layout} key={item.id} item={item} />;
          default:
            return false;
        }
      });
  }

  return (
    <Aux>
      <li key={props.group.id} className="nav-item pcoded-menu-caption">
        <label>{props.group.title}</label>
      </li>
      {navItems}
    </Aux>
  );
};

export default navGroup;
