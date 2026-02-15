import React from "react";
import ps5 from "../assets/ps5.png";
import macbook from "../assets/macbook.png";
import airpods from "../assets/airpods.png";
import visionpro from "../assets/visionpro.png";
import { Link } from "react-router-dom";

const AppleShowcase = () => {
  return (
    <section className="bg-[#ededed] dark:bg-gray-900 text-black dark:text-white">
      <div className="mx-auto max-w-[1240px] grid grid-cols-1 md:grid-cols-2">
        <div className="grid grid-rows-[1.08fr_0.92fr]">
          <Link
            to="/shop"
            className="relative bg-[#f6f6f6] dark:bg-gray-700 min-h-[250px] md:min-h-[285px] overflow-hidden flex items-center pl-[120px] md:pl-[180px] pr-6 md:pr-10"
          >
            <img
              src={ps5}
              alt="Playstation 5"
              className="absolute left-[-44px] bottom-0 w-[180px] md:w-[220px] object-contain"
            />
            <div className="relative z-10">
              <h2 className="text-[clamp(2rem,3vw,3.2rem)] font-semibold leading-[1.02] mb-3">
                Playstation 5
              </h2>
              <p className="text-[#7e7e7e] dark:text-gray-300 text-xs md:text-sm leading-5 max-w-[360px]">
                Incredibly powerful CPUs, GPUs, and an SSD with integrated I/O
                will redefine your PlayStation experience.
              </p>
            </div>
          </Link>

          <div className="grid grid-cols-2">
            <Link
              to="/shop"
              className="relative bg-[#ededed] dark:bg-gray-800 min-h-[210px] p-4 md:p-5 overflow-hidden"
            >
              <img
                src={airpods}
                alt="AirPods Max"
                className="absolute left-[-30px] top-0 w-[110px] md:w-[132px] object-contain"
              />
              <div className="relative z-10 mt-[72px] md:mt-[86px] pl-12 md:pl-24">
                <h3 className="text-[clamp(1.2rem,1.8vw,2.1rem)] leading-none">
                  Apple
                </h3>
                <h3 className="text-[clamp(1.2rem,1.8vw,2.1rem)] leading-none">
                  AirPods
                </h3>
                <h3 className="text-[clamp(1.2rem,1.8vw,2.1rem)] leading-none font-semibold mb-2">
                  Max
                </h3>
                <p className="text-[11px] md:text-xs leading-5 text-[#7e7e7e] dark:text-gray-300 max-w-[220px]">
                  Computational audio. Listen, it’s powerful.
                </p>
              </div>
            </Link>

            <Link
              to="/shop"
              className="relative bg-[#353535] text-white min-h-[220px] p-4 md:p-5 overflow-hidden"
            >
              <img
                src={visionpro}
                alt="Vision Pro"
                className="absolute left-[-30px] top-2 w-[110px] md:w-[132px] object-contain"
              />
              <div className="relative z-10 mt-[72px] md:mt-[86px] pl-12 md:pl-24">
                <h3 className="text-[clamp(1.2rem,1.8vw,2.1rem)] leading-none">
                  Apple
                </h3>
                <h3 className="text-[clamp(1.2rem,1.8vw,2.1rem)] leading-none font-semibold mb-2">
                  Vision Pro
                </h3>
                <p className="text-[11px] md:text-xs leading-5 text-gray-300 max-w-[220px]">
                  An immersive way to experience entertainment
                </p>
              </div>
            </Link>
          </div>
        </div>

        <Link
          to="/shop"
          className="relative bg-[#ededed] dark:bg-gray-700 min-h-[420px] md:min-h-[495px] flex items-center px-6 md:px-8 lg:px-10 overflow-hidden"
        >
          <div className="max-w-[340px] relative z-10">
            <h2 className="text-[clamp(2.4rem,4vw,4.2rem)] font-light leading-none">
              Macbook
            </h2>
            <h2 className="text-[clamp(2.4rem,4vw,4.2rem)] font-bold leading-none mb-4">
              Air
            </h2>
            <p className="text-[#7e7e7e] dark:text-gray-300 text-xs md:text-sm leading-6 mb-8 max-w-[330px]">
              The new 15‑inch MacBook Air makes room for more of what you love
              with a spacious Liquid Retina display.
            </p>
            <span className="inline-flex px-8 py-2 border border-black dark:border-white rounded text-xs md:text-sm">
              Shop Now
            </span>
          </div>
          <img
            src={macbook}
            alt="MacBook Air"
            className="absolute right-[-6px] md:right-[-12px] bottom-0 h-[86%] max-h-[470px] w-auto object-contain"
          />
        </Link>
      </div>
    </section>
  );
};

export default AppleShowcase;
