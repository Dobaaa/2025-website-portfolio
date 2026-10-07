"use client";

import { FaLocationArrow } from "react-icons/fa6";

import { socialMedia } from "@/data";
import MagicButton from "./MagicButton";
import Link from "next/link";
import { usePortfolio } from "./PortfolioProvider";
import { socialIcon } from "@/lib/portfolio";

const Footer = () => {
  const { status, data } = usePortfolio();
  const settings = data?.settings;
  const links =
    status === "ready" && data
      ? data.social_links.map((item) => ({
        id: item.id,
        img: socialIcon(item.icon),
        link: item.url,
      }))
    : status === "error"
      ? socialMedia
      : [];
  const heading =
    settings?.footer_heading ||
    "Ready to take your digital presence to the next level?";
  const accent = heading.match(/^(.*?)(\byour\b)(.*)$/i);

  return (
    <footer className="w-full pt-20 pb-10 scroll-mt-24" id="contact">
      {/* background grid */}
      <div className="w-full absolute left-0 -bottom-72 min-h-96">
        <img
          src="/footer-grid.svg"
          alt="grid"
          className="w-full h-full opacity-50 "
        />
      </div>

      <div className="flex flex-col items-center">
        <h1 className="heading lg:max-w-[45vw]">
          {accent ? (
            <>
              {accent[1]}
              <span className="text-purple">{accent[2]}</span>
              {accent[3]}
            </>
          ) : (
            heading
          )}
        </h1>
        <p className="text-white-200 md:mt-10 my-5 text-center">
          {settings?.footer_text ||
            "Reach out to me today and let's discuss how I can help you achieve your goals."}
        </p>
        <a href={`mailto:${settings?.contact_email || "elhwtdoba@gmail.com"}`}>
          <MagicButton
            title="Let's get in touch"
            icon={<FaLocationArrow />}
            position="right"
          />
        </a>
      </div>
      <div className="flex mt-16 md:flex-row flex-col justify-between items-center">
        <p className="md:text-base text-sm md:font-normal font-light">
          {settings?.copyright_text || "Copyright © 2025 Ahmed Jamal"}
        </p>

        <div className="flex items-center md:gap-3 gap-6">
          {links.map((info) => (
            <Link
              href={info.link}
              key={info.id}
              className="w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300"
            >
              <img src={info.img} alt="icons" width={20} height={20} />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
