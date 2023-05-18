// pages/_app.js
import { ToastContainer, Slide } from "react-toastify";

import "react-toastify/dist/ReactToastify.min.css";
const MyApp = ({ Component, pageProps }) => {
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer
        className="impct-toast"
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange
        draggable={false}
        pauseOnHover
        transition={Slide}
      />
    </>
  );
};

export default MyApp;
