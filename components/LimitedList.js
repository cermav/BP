import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";

const LimitedList = props => {
    const limit = props.limit;
    const [maxTags, setMaxTags] = useState(limit);
    const windowReduxObject = useSelector(state => state.window);
    useEffect(() => {
        //    console.log(windowReduxObject, windowReduxObject.width > 768)
        if (windowReduxObject.width > 768) {
            setMaxTags(limit);
        } else {
            setMaxTags(Math.round(limit / 2));
        }
        //        console.log(maxTags);
    }, [windowReduxObject]);

    const [hiddenTags, toggleTagVis] = useState(true);
    const moreTags = ev => {
        ev.preventDefault();
        toggleTagVis(!hiddenTags);
        //    expertArray.map(); here is where you
    };
    props.data
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .map(i => {
            props.data.indexOf(i) < maxTags ? (i.collapsable = false) : (i.collapsable = true);
        });
    return (
        <>
            {props.data &&
                props.data.map(i => (
                    <span key={i.id} className={"tagLike " + (i.collapsable === true ? (hiddenTags === true ? " hidden" : " visible") : "")}>
                        {i.name}
                    </span>
                ))}
            {/* props.hidden && props.hidden===true ? " hidden" : " visible" */}
            {props.data && props.data.length > maxTags && (
                <Link href="">
                    <a className="moreTags" onClick={moreTags}>
                        {hiddenTags ? "..." : "x"}
                    </a>
                </Link>
            )}
        </>
    );
};
LimitedList.defaultProps = {
    data: [],
    limit: 15
};
export default LimitedList;
