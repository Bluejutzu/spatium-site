import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { Button } from '../ui/button';
import DarkVeil from '../ui/DarkVeil';


export default function Hero1() {
  return (
    <div className="relative w-full bg-neutral-950">
      <DarkVeil
      speed={0.75}
      warpAmount={3}
      />
      <div className="absolute top-0 z-[0] h-full w-full bg-neutral-900/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <section className="z-1 relative mx-auto max-w-full">
        <div className="pointer-events-none absolute h-full w-full overflow-hidden opacity-50 [perspective:200px]">
          <div className="absolute inset-0 [transform:rotateX(35deg)]">
            <div className="animate-grid [background-image:linear-gradient(to_right,rgba(255,255,255,0.25)_1px,transparent_0),linear-gradient(to_bottom,rgba(255,255,255,0.2)_1px,transparent_0)] [background-repeat:repeat] [background-size:120px_120px] [height:300vh] [inset:0%_0px] [margin-left:-50%] [transform-origin:100%_0_0] [width:600vw]"></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent to-90%"></div>
        </div>

        <div className="z-10 mx-auto max-w-screen-xl gap-12 px-4 py-28 text-gray-600 md:px-8">
          <div className="leading-0 mx-auto max-w-3xl space-y-5 text-center lg:leading-5">
            <h1 className="font-geist group mx-auto w-fit rounded-3xl border-[2px] border-white/5 bg-gradient-to-tr from-zinc-300/5 via-gray-400/5 to-transparent px-5 py-2 text-sm text-gray-400">
              Appeal to your audience
            </h1>

            <h2 className="font-geist mx-auto bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] bg-clip-text text-4xl tracking-tighter text-transparent md:text-6xl">
              Accelerate your Discord Servers manual work with a{' '}
              <span className="bg-gradient-to-r from-purple-300 to-orange-200 bg-clip-text text-transparent">
                reliable Solution
              </span>
              .
            </h2>

            <p className="mx-auto max-w-2xl text-2xl text-gray-300/70">
              Spatium is a Discord bot that helps you manage your server faster and more efficiently. With <span className=" bg-gradient-to-r from-discord-blurple to-discord-purple bg-clip-text glow-text"> UX</span> being first.
            </p>

          </div>
          <div className="mx-10 mt-24">
            <Image
              src="/Demo.png"
              className="w-full rounded-lg border shadow-lg"
              alt=""
              width={1920}
              height={1080}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
