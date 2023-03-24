import React from "react";
import PropTypes from "prop-types";
import Router from "next/router";

const sections = [
    { id: 1, name: "Základní informace", url: "/vet/profile" },
  {id: 2, name: "Ceník", url: "/vet/profile/price-list"}];

const Tabs = ({ activeTab }) => {
  const setActiveTab = (id) => {
    Router.push(sections.filter((s) => s.id === id)[0].url);
  };

  return (
    <ul className="tabs">
      {sections.map((tab) => (
        <li className="tab" key={`tab-${tab.id}`}>
          <button onClick={() => setActiveTab(tab.id)} className={`tabButton ${activeTab === tab.id ? "active" : ""}`}>
            {tab.name}
          </button>
        </li>
      ))}
    </ul>
  );
};

Tabs.propTypes = {
  activeTab: PropTypes.number.isRequired,
};

export default Tabs;
