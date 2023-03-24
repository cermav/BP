import React from "react";
import Link from "next/link";

const Hero = (props) => {
  /*  const [width, setWidth] = useState(0.56 * window.innerWidth);
  useEffect(() => {
    const containerWidth = document.getElementById('header').offsetWidth;
    const handleResize = () => setWidth(0.56 * containerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  })*/
  return (
    <div className="hero">
      <div className="container">
        <div className="heroInner">
          <div className="heroContent">
            <h1 dangerouslySetInnerHTML={{ __html: props.hero.title }} className="lg" />
            {props.hero.content.split("\n").map((i) => {
              return <p key={i}>{i}</p>;
            })}
            {props.hero.button && (
              <Link href={props.hero.buttonURL}>
                <a className="button lg white" id="heroButton">
                  {props.hero.button}
                </a>
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="heroIllustration" id="heroIllustration"></div>
    </div>
  );
};
export default Hero;
