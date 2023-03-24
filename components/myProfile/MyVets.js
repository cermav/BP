import React from "react";
import VetThumbnailCard from "../VetThumbnailCard";

const MyVets = props => {
    return (
        <div className="myVets">
            <div className="myVetsInner">
                <div className="sectionHeader">
                    <div className="flexContainer">
                        <h2>Moji veterináři</h2>
                        {/* TODO: Add the edit icon  */}
                        <button className="button geraldineBorder editButton">Upravit</button>
                    </div>
                </div>
                <div className="myVetsList">
                    <ul className="flexContainer">
                        <li>
                            <VetThumbnailCard />
                        </li>
                        <li>
                            <VetThumbnailCard />
                        </li>
                        <li className="addVet">
                            <span>+</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MyVets;