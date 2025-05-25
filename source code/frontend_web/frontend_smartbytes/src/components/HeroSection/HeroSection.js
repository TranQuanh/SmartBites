import './HeroSection.scss';
import CustomImage from '../CustomeImage/CustomeImage';
function HeroSection() {
  const images = [
    "/img/gallery/img_1.jpg",
    "/img/gallery/img_2.jpg",
    "/img/gallery/img_3.jpg",
    "/img/gallery/img_4.jpg",
    "/img/gallery/img_5.jpg",
    "/img/gallery/img_6.jpg",
    "/img/gallery/img_7.jpg",
    "/img/gallery/img_8.jpg",
    "/img/gallery/img_9.jpg",
  ];

  const List =[
    "Learn new recepies",
    "Experiment with Food",
    "Write your own recepies",
    "Know nutition faacts",
    "Get cooking tips",
    "Get ranked"
  ]
  return (
    <>
    {/* What we are about */}
    <div className="section hero container main">
      <div className = "col typography">
        <h1 className = "title">What Are We About</h1>
        <p className ="info">
          SmartByte is a place where you can please your soul and tummy with selicious food recepies of all cuisine.
          And our service is absolutely free. So start exploring now.
        </p>
        <button className = "btn btn-primary">EXPLORE NOW</button>
      </div>
      <div className = "col gallery">
        {images.map((src,index)=>(
          <CustomImage key={index} imgSrc={src} pt={"90%"}/>
        ))}

      </div>
    </div>

    {/* Improve Your Culinary Skills */}
    <div className="section improveskills container main">
      <div className = "col img">
          <img src="/img/gallery/img_10.jpg"/>
      </div>
      <div className = "col typography">
        <h1 className = "title">What Are We About</h1>
        {List.map((item,index)=>(
          <p className = "skill-item" key={index}>{item}</p>
        ))}
        <button className = "btn btn-primary">SIGN UP NOW</button>
      </div>
    </div>
    </>

    
  );
}
export default HeroSection;