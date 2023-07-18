import { EXPERIMENT, UID_COOKIE, GROUP_PARAM_FALLBACK } from "@/lib/constants";
import api from "@/lib/statsig-api";
import Link from "next/link";
import Button from "../Button";

export async function generateStaticParams() {
  const groups: string[] = (await api.getBuckets(EXPERIMENT))
    .concat(GROUP_PARAM_FALLBACK)
    .filter(Boolean);

  return groups.map((group) => ({ bucket: group }));
}

export default function Page({ params }: { params: { bucket: string } }) {
  const bucket = params?.bucket as string;

  return (
    <main className="flex min-h-screen flex-col container divide-y">
      <section className="mt-6 py-4">
        <div className="space-y-4 divide-y">
          <h1 className="text-xl font-bold uppercase">
            A/B Testing with NextJS, Vercel, and Statsig
          </h1>
          <h3 className="text-red-500 pt-4 font-bold uppercase">
            Your bucket: {bucket}
          </h3>
          <p className="text-slate-400 pt-4">
            Performant experimentation with Statsig
          </p>
          <p className="pt-4">
            In this template we use Statsig&apos;s Server SDK at the edge to
            pull experiment variants and show the resulting allocation. We
            leverage the{" "}
            <Link
              href="https://vercel.com/integrations/statsig"
              target="_blank"
            >
              edge config integration
            </Link>{" "}
            to pull Statsig configurations from the edge. As long as you have a
            bucket assigned you will always see the same result, otherwise you
            will be assigned a bucket to mantain the odds specified in the
            experiment.
          </p>
          <p className="pt-4">
            The variation's bucket is statically generated at build time in a
            /bucket page. All changes for the experiment should be made in this
            page. The root page is the control in the experiment. The middleware
            pulls the bucket names using the Statsig SDK and redirects traffic
            to the corresponding page based on which bucket a visitor is
            assigned to.
          </p>
          <div className="pt-4">
            <p>
              You are currently assigned to the{" "}
              <span className="text-red-500">{bucket}</span> bucket. Click the
              button below to reset your cookie and refresh the page. Clicking
              the button will trigger the middleware to run and will re-bucket
              you.
            </p>
            <Button />
          </div>
        </div>
      </section>
    </main>
  );
}