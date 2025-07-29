// src/app/page.tsx
"use server";

import CodeExamples from "~/components/client/code-examples";
import CopyButton from "~/components/client/copy-button";
import { Inference } from "~/components/client/Inference";
import { SignOutButton } from "~/components/client/signout";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export default async function HomePage() {
  const session = await auth();

  const quota = await db.apiQuota.findUniqueOrThrow({
    where: {
      userId: session?.user.id,
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#0f0c29] via-[#302b63] to-[#24243e] text-white flex flex-col">
      {/* Navbar */}
      <nav className="flex h-16 items-center justify-between px-10 border-b border-white/20">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-black font-bold">
            SA
          </div>
          <span className="text-lg font-semibold tracking-wide">
            Sentiment AI
          </span>
        </div>
        <SignOutButton />
      </nav>

      {/* Main content */}
      <main className="flex flex-1 flex-col gap-6 p-4 sm:p-10 md:flex-row">
        {/* Inference Component */}
        <section className="w-full md:w-1/2 rounded-2xl bg-white/10 backdrop-blur p-6 border border-white/20 shadow-md">
          <Inference quota={{ secretKey: quota.secretKey }} />
        </section>

        {/* Divider for desktop */}
        <div className="hidden md:block w-px bg-white/20" />

        {/* API Info */}
        <section className="flex w-full flex-col gap-6 md:w-1/2">
          <div className="rounded-2xl bg-white/10 backdrop-blur p-6 border border-white/20 shadow-md">
            <h2 className="text-lg font-semibold mb-2">API Access</h2>
            <p className="text-sm text-gray-300">
              Use your secret key to call our API. Keep it private.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2 justify-between">
              <span className="text-sm font-medium">Key</span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-full max-w-[200px] overflow-x-auto rounded-md border border-white/20 bg-white/5 px-3 py-1 text-sm text-white sm:w-auto">
                  {quota.secretKey}
                </span>
                <CopyButton text={quota.secretKey} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white/10 backdrop-blur p-6 border border-white/20 shadow-md">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Monthly quota</span>
              <span className="text-sm text-gray-300">
                {quota.requestsUsed} / {quota.maxRequests} requests
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/20">
              <div
                style={{
                  width:
                    (quota.requestsUsed / quota.maxRequests) * 100 + "%",
                }}
                className="h-2 rounded-full bg-white"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-white/10 backdrop-blur p-6 border border-white/20 shadow-md">
            <CodeExamples />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-300 py-4 border-t border-white/20">
        © {new Date().getFullYear()} Huy Doan. All rights reserved.
      </footer>
    </div>
  );
}
