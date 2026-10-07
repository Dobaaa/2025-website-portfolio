"use client";

import { motion } from "framer-motion";
import { FaLocationArrow } from "react-icons/fa6";

import MagicButton from "./MagicButton";
import { Spotlight } from "./ui/Spotlight";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";
import { usePortfolio } from "./PortfolioProvider";
import { mediaUrl } from "@/lib/portfolio";

const Hero = () => {
  const { status, data } = usePortfolio();
  const settings = data?.settings;
  const heroReady = status !== "loading";
  const heroTitle =
    settings?.hero_title ||
    "Transforming Concepts into Seamless User Experiences";
  const heroSubtitle =
    settings?.hero_subtitle ||
    "Hi! I'm Ahmed Jamal, a Software Engineer & Salesforce Developer based in Egypt.";
  const subtitleDelay = Math.max(heroTitle.split(" ").length - 1, 0) * 0.2 + 1;
  const cvUrl = mediaUrl(settings?.cv_path) || "/Ahmed Jamal Hussien.pdf";

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = cvUrl;
    link.download = settings?.cv_original_name || "Ahmed-Jamal-CV.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="home" className="relative min-h-screen overflow-hidden pb-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Spotlight
          className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen"
          fill="white"
        />
        <Spotlight
          className="h-[80vh] w-[50vw] top-10 left-full"
          fill="purple"
        />
        <Spotlight className="left-80 top-28 h-[80vh] w-[50vw]" fill="blue" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 dark:bg-black-100 bg-white dark:bg-grid-white/[0.03] bg-grid-black-100/[0.2]"
        aria-hidden
      >
        <div
          className="absolute inset-0 dark:bg-black-100 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
          aria-hidden
        />
      </div>

      <div
        className="doba-img pointer-events-none absolute inset-0"
        style={
          settings?.hero_image
            ? { backgroundImage: `url(${mediaUrl(settings.hero_image)})` }
            : undefined
        }
        aria-hidden
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-24">
        <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
          <p className="uppercase tracking-widest text-xs text-center text-blue-100 max-w-80">
            {settings?.hero_label || "Ahmed Jamal portfolio"}
          </p>

          {heroReady ? (
            <TextGenerateEffect
              words={heroTitle}
              className="text-center text-[40px] md:text-5xl lg:text-6xl"
            />
          ) : (
            <div className="my-4 h-[4.5rem] md:h-24" />
          )}

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={heroReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{
              duration: 0.8,
              delay: heroReady ? subtitleDelay : 0,
              ease: "easeOut",
            }}
            className="text-center md:tracking-wider mb-4 text-sm md:text-lg lg:text-2xl"
          >
            {heroSubtitle}
          </motion.p>

          <a href="#about">
            <MagicButton
              title="Download My CV"
              icon={<FaLocationArrow />}
              position="right"
              handleClick={handleDownload}
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
