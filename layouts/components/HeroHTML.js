import React from "react";
import Link from "next/link";

const HeroHTML = props => {
    /*  const [width, setWidth] = useState(0.56 * window.innerWidth);
  useEffect(() => {
    const containerWidth = document.getElementById('header').offsetWidth;
    const handleResize = () => setWidth(0.56 * containerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  })*/
    //    console.log(props.heroHTML);
    return (
        <div className="hero">
            <div className="container">
                <div className="heroInner">
                    <div className="heroContent" dangerouslySetInnerHTML={{ __html: props.heroHTML }}></div>
                </div>
            </div>
            <div className="heroIllustration" id="heroIllustration"></div>
        </div>
    );
};
export default HeroHTML;
