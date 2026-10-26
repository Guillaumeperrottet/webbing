import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Application {
  name: string;
  category: string;
  tagline: string;
  description: string;
  logo: string;
  image: string;
  url: string;
  imageWidth: number;
  imageHeight: number;
  partnerUrl?: string;
}

const applications: Application[] = [
  {
    name: "SelfCamp",
    category: "Solution Camping",
    tagline: "La liberté de camper sans contrainte",
    description:
      "Une solution complète pour créer des aires de camping-car qui bénéficient aux communes, aux régions et aux vanlifers. En collaboration avec l'Union fribourgeoise du Tourisme.",
    logo: "/logo_app/logo_selfcamp.png",
    image: "/selfcamp_accueil.png",
    url: "https://www.selfcamp.ch/",
    imageWidth: 3004,
    imageHeight: 1922,
    partnerUrl: "https://fribourg.ch/fr/uft-ftv/",
  },
  {
    name: "Wisp",
    category: "Transfert & Stockage",
    tagline: "Cloud suisse",
    description:
      "Solution suisse de stockage et de partage de fichiers. Bibliothèque d'images, transfert rapide jusqu'à 2 GB, et édition de documents via Collabora — une alternative concrète à Google Drive et Microsoft 365, hébergée en Suisse.",
    logo: "/logo_app/logo_wisp.png",
    image: "/wisp_application.png",
    url: "https://wisp.ch/",
    imageWidth: 3438,
    imageHeight: 1926,
  },
  {
    name: "PlanniKeeper",
    category: "Gestion Immobilière",
    tagline: "Organisez • Planifiez • Maîtrisez",
    description:
      "Gestion efficace de vos tâches liées à vos biens immobiliers dans une interface intuitive et élégante. Planifiez les travaux, suivez les interventions et centralisez toute la gestion depuis une seule plateforme.",
    logo: "/logo_app/logo_plannikeeper.png",
    image: "/plannikeeper_application.png",
    url: "https://www.plannikeeper.ch/",
    imageWidth: 3450,
    imageHeight: 1918,
  },
  {
    name: "OpenWind",
    category: "Sports de vent",
    tagline: "Trouvez votre spot, capturez le vent",
    description:
      "Plateforme communautaire et open-source dédiée aux passionnés de kitesurf, wing ou parapente. Découvrez les meilleurs spots, consultez les prévisions de vent en temps réel et planifiez vos sessions en cherchant le vent grâce au module de planification.",
    logo: "/logo_app/logo_openwind.png",
    image: "/openwind_application.png",
    url: "https://www.openwind.ch/",
    imageWidth: 3334,
    imageHeight: 1934,
  },
];

export default function ApplicationsPage() {
  const [selfcamp, ...otherApplications] = applications;
  return (
    <>
      <section id="selfcamp" className="page-intro">
        <div className="site-container grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-12">
          <div className="min-w-0">
            <Image src={selfcamp.logo} alt="" width={80} height={80} className="mb-6 h-20 w-20 object-contain" />
            <h1 className="page-title">{selfcamp.name}</h1>
            <p className="page-lead mt-6">{selfcamp.tagline}</p>
            <p className="mt-6 max-w-prose text-base leading-relaxed text-muted-foreground">
              Une solution complète pour créer des aires de camping-car qui bénéficient aux communes, aux régions et aux vanlifers. En collaboration avec{' '}
              <Link href={selfcamp.partnerUrl!} target="_blank" rel="noopener noreferrer" className="rounded-sm underline underline-offset-4">l’Union fribourgeoise du Tourisme</Link>.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link href={selfcamp.url} target="_blank" rel="noopener noreferrer">Découvrir SelfCamp<ArrowRight aria-hidden="true" /></Link>
            </Button>
          </div>
          <Image
            src={selfcamp.image}
            alt="SelfCamp, réservation d’aires de camping-car"
            width={selfcamp.imageWidth}
            height={selfcamp.imageHeight}
            priority
            sizes="(max-width: 767px) 100vw, 55vw"
            className="h-auto w-full rounded-lg"
          />
        </div>
      </section>

      <section id="applications" className="site-section">
        <div className="site-container">
          <h2 className="section-heading">Nos autres applications web</h2>
          <p className="page-lead">Toutes nos applications sont accessibles en ligne et hébergées en Suisse.</p>
          <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-x-8 gap-y-16 lg:grid-cols-[repeat(3,minmax(0,1fr))]">
            {otherApplications.map((app) => (
              <article key={app.name} className="flex min-w-0 flex-col">
                <div className="mb-6 flex min-h-20 items-center gap-4">
                  <Image
                    src={app.logo}
                    alt=""
                    width={64}
                    height={64}
                    className="h-16 w-16 shrink-0 object-contain"
                  />
                  <div className="min-w-0">
                    <h3 className="application-name min-w-0 break-words font-display font-bold text-foreground">
                      {app.name}
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                      {app.tagline}
                    </p>
                  </div>
                </div>

                <Image
                  src={app.image}
                  alt={`Interface de ${app.name}`}
                  width={app.imageWidth}
                  height={app.imageHeight}
                  sizes="(max-width: 767px) 100vw, (max-width: 1439px) 50vw, 640px"
                  className="mb-6 h-auto w-full rounded-lg border border-border"
                />

                <div className="flex flex-1 flex-col items-start">
                  <p className="mb-3 text-sm text-muted-foreground">
                    {app.category}
                  </p>
                  <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                    {app.partnerUrl
                      ? app.description
                          .split("l'Union fribourgeoise du Tourisme")
                          .map((part, i, arr) =>
                            i < arr.length - 1 ? (
                              <span key={i}>
                                {part}
                                <Link
                                  href={app.partnerUrl!}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="rounded-sm underline underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none"
                                >
                                  l&apos;Union fribourgeoise du Tourisme
                                </Link>
                              </span>
                            ) : (
                              <span key={i}>{part}</span>
                            ),
                          )
                      : app.description}
                  </p>
                  <Button variant="outline" size="lg" className="mt-auto" asChild>
                    <Link
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`En savoir plus sur ${app.name}`}
                    >
                      En savoir plus
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section border-t border-border bg-muted">
        <div className="site-container flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <h2 className="section-heading">Une application en tête ?</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Discutons-en et créons-la ensemble.
            </p>
          </div>
          <Button size="lg" className="shrink-0" asChild>
            <Link href="/contact">
              Nous contacter
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
