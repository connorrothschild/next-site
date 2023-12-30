import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { easeInOutQuint } from "@/config/eases";
import Jukebox from "./Jukebox";
import CanvasGradient from "./CanvasGradient";
import { useRouter } from "next/router";

const menuItems = [
  {
    href: "/#home",
    w: "Home",
  },
  // {
  //   href: "#about",
  //   w: "About",
  // },
  {
    href: "/#work",
    w: "Projects",
  },
  {
    href: "/#contact",
    w: "Contact",
  },
];

export default function Menu({}) {
  const [showMenu, setShowMenu] = useState(false);

  const MENU_IN_DURATION = 1;
  const WORD_IN_DURATION = 1;

  const container = {
    hidden: { translateY: "100%" },
    show: {
      translateY: 0,
      transition: {
        duration: MENU_IN_DURATION,
        ease: easeInOutQuint,
        staggerChildren: 0.5,
        delayChildren: MENU_IN_DURATION,
      },
    },
    exit: {
      translateY: "-100%",
    },
  };

  const word = {
    hidden: {
      opacity: 1,
      translateY: "-100%",
    },
    show: {
      opacity: 1,
      translateY: 0,
      transition: {
        duration: WORD_IN_DURATION,
        delay: MENU_IN_DURATION,
        ease: easeInOutQuint,
        staggerChildren: 0.05,
        delayChildren: MENU_IN_DURATION,
      },
    },
    exit: {
      opacity: 0,
    },
  };

  const letter = {
    // From translateX: 100% to translateX: 0
    hidden: { translateY: "100%" },
    show: {
      translateY: 0,
      transition: {
        duration: WORD_IN_DURATION,
        ease: easeInOutQuint,
      },
    },
    exit: {
      //   translateY: "-100%",
      opacity: 0,
    },
  };

  const ampersand = {
    // From translateX: 100% to translateX: 0
    hidden: { opacity: 0, translateY: "100%" },
    show: {
      opacity: 1,
      translateY: 0,
      transition: {
        duration: WORD_IN_DURATION / 4,
        ease: easeInOutQuint,
      },
    },
    exit: {
      //   translateY: "-100%",
      opacity: 0,
    },
  };

  const router = useRouter();
  const routeIsHome = router.pathname === "/";

  return (
    <>
      {/* Note that the menu is hidden on page load, once the Loader component applies .loaded it will be visible (see globals.css) */}
      {/* If the route is not /, that means there is no loading animation. In that case, we should apply the CanvasGradient behind the menu */}
      {routeIsHome ? null : (
        <div className="h-[60px] bg-gray-900 z-20 fixed top-[20px] left-[20px] w-[calc(100vw-40px)] rounded-[10px]" />
      )}
      <p
        id="menu-button"
        className={`opacity-0 pointer-events-none fixed top-6 left-6 p-4 cursor-pointer text-lg z-50 leading-none font-serif transition-all duration-200 delay-200 text-gray-100`}
        onClick={() => {
          setShowMenu(!showMenu);
        }}
      >
        Menu
      </p>

      {/* We want to render the Jukebox at all times so that it plays even when not visible. We only toggle visibility, not rendering. */}
      <Jukebox controllerIsVisible={showMenu} />

      <AnimatePresence>
        {showMenu && (
          <motion.div
            variants={container}
            key="menu"
            initial="hidden"
            animate="show"
            exit="exit"
            transition={{ duration: MENU_IN_DURATION, ease: easeInOutQuint }}
            className="z-40 fixed top-0 left-0 w-screen h-screen flex justify-center items-center flex-col md:flex-row gap-x-2 gap-y-0 font-serif overflow-hidden leading-[1.2] cursor-pointer"
            // style={{
            //   background: "rgba(0,0,0,.7)",
            //   backdropFilter: "blur(7px)",
            // }}
          >
            <CanvasGradient />
            {/* <div className=""> */}
            {menuItems.map(({ href, w }, index) => (
              <motion.a
                variants={word}
                key={`menu-${index}`}
                initial="hidden"
                animate="show"
                exit="exit"
                className="text-white text-4xl overflow-hidden leading-snug"
                onClick={() => {
                  setShowMenu(false);
                  // const element = document.querySelector(href);
                  // element.scrollIntoView({
                  //   behavior: "smooth",
                  // });
                }}
                href={href}
              >
                {w.split("").map((l, index) => {
                  return (
                    <motion.span
                      variants={letter}
                      key={index}
                      className="inline-block"
                    >
                      {l}
                    </motion.span>
                  );
                })}{" "}
                {index < menuItems.length - 1 && (
                  <motion.span
                    className="text-gray-300 opacity-50 font-serif font-light text-4xl overflow-hidden"
                    variants={ampersand}
                  >
                    &
                  </motion.span>
                )}
              </motion.a>
            ))}
            {/* </div> */}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
