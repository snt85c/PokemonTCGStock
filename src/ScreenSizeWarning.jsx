import mockup from "./img/mockup.jpg";
import logo from "./img/TCGStock_Logo_3000x3000.png";
import googlestore from "./img/google-play-badge.png";
import applestore from "./img/Download_on_the_Mac_App_Store_Badge_US-UK_RGB_blk_092917.svg";
export default function ScreenSizeWarning() {
  return (
    <>
      <div className=" hidden sm:flex   w-full h-full absolute bg-black text-white z-50 justify-center items-center select-none p-5">
        <div className="flex flex-col justify-center items-center">
          {" "}
          <img src={logo} /> for a better user experience visit us on your
          mobile
        <img src={googlestore} width={175}/>
        <img src={applestore} />
        </div>
        <div className="mockup-phone m-0 ml-20  ">
          <div className="camera"></div>
          <div className="display">
            <div className="artboard artboard-demo phone-1 ">
              <img src={mockup} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
