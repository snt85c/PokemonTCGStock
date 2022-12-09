import { useUserAuth } from "../ProfileComponents/userAuth";
import GoogleButton from "react-google-button";
import mockup from "../img/mockup.jpg";
import logo from "../img/TCGStock_Logo_3000x3000.png";
import ContactUs from "../ProfileComponents/ContactUs";
import ScreenSizeWarning from "../ScreenSizeWarning";
import googlestore from "../img/google-play-badge.png";
import applestore from "../img/Download_on_the_Mac_App_Store_Badge_US-UK_RGB_blk_092917.svg";

export default function SigninPage() {
  const { user, googleSignIn } = useUserAuth();

  function Login() {
    return (
      <GoogleButton
        onClick={() => {
          googleSignIn();
        }}
      />
    );
  }
  return (
    <>
    <div className="hidden sm:flex"><ScreenSizeWarning /></div>
    <div className="bg-black h-full w-full overflow-scroll flex sm:hidden flex-col font-[PlayR] text-white">
      <div className="text-white flex justify-center items-center text-[3rem] mt-10 ">Welcome</div>
      <img src={logo} className="mx-5 my-10" />
      <p className="m-10 text-justify  font-bold"> The newest solution on the market to keep track of your Pokemon TGC Cards! Search and add to multiple collections, get all your data in one place! </p>
      <div className="mockup-phone">
        <div className="camera"></div>
        <div className="display">
          <div className="artboard artboard-demo phone-1">
            <img src={mockup} />
          </div>
        </div>
      </div>
      
      <p className="m-10 mb-0 text-justify  font-bold "> Keeping an eye on your collection has never been this Easy!</p>
      <div className="my-20 p-10 flex flex-col justify-center items-center gap-2">
        <div className="flex justify-center text-amber-500 font-extrabold text-[2rem]">Sign in to begin</div>
        <Login />
      </div>
      <div className="flex justify-center items-center mb-5">

      <img src={googlestore} width={175}/>
        <img src={applestore} width={165}/>
      </div>
      <ContactUs />
    </div>
    </>
  );
}
