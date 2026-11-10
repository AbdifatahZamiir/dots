import Image from "next/image";

// Editorial mood images, free to use under the Pexels license (https://www.pexels.com/license/).
// These are styling inspiration, not DOTS products.
const looks = [
  { src: "/lookbook/look-1.jpg", alt: "Man in an all-black outfit seated in a studio", credit: "cottonbro studio", url: "https://www.pexels.com/photo/9064081/" },
  { src: "/lookbook/look-2.jpg", alt: "Man in a beige sweatshirt and black trousers by a window", credit: "Ba Tik", url: "https://www.pexels.com/photo/3754247/" },
  { src: "/lookbook/look-3.jpg", alt: "Beige trench coat and pleated trousers", credit: "Yaroslava Borz", url: "https://www.pexels.com/photo/10153584/" },
  { src: "/lookbook/look-4.jpg", alt: "Man in a black tee and dark denim in a studio", credit: "K O R A Y B O Z K U R T", url: "https://www.pexels.com/photo/16646775/" },
  { src: "/lookbook/look-5.jpg", alt: "Man in a camel knit cardigan and cream trousers", credit: "Elina Volkova", url: "https://www.pexels.com/photo/12056637/" },
];

export default function Lookbook() {
  const [hero, ...rest] = looks;
  return (
    <section id="lookbook" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24">
      <div className="mb-10 flex flex-col items-center text-center">
        <span className="mb-5 size-3 rounded-full bg-ink" />
        <p className="text-[11px] uppercase tracking-[0.4em] text-muted">Wear your story</p>
        <h2 className="mt-3 text-2xl font-light uppercase tracking-[0.3em]">Lookbook</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-12 md:gap-4">
        <figure className="group relative col-span-2 aspect-[4/5] overflow-hidden bg-cream md:col-span-6 md:row-span-2 md:aspect-auto">
          <Image
            src={hero.src}
            alt={hero.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition duration-1000 group-hover:scale-[1.03]"
          />
          <figcaption className="absolute bottom-0 left-0 p-6 text-cream">
            <p className="text-xl font-light uppercase leading-snug tracking-[0.25em] drop-shadow">
              Quality in
              <br />
              every detail.
            </p>
          </figcaption>
        </figure>
        {rest.map((l) => (
          <figure
            key={l.src}
            className="group relative aspect-[4/5] overflow-hidden bg-cream md:col-span-3"
          >
            <Image
              src={l.src}
              alt={l.alt}
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover transition duration-1000 group-hover:scale-[1.03]"
            />
          </figure>
        ))}
      </div>

      <p className="mt-6 text-center text-[10px] text-muted">
        Photos via Pexels:{" "}
        {looks.map((l, i) => (
          <span key={l.url}>
            <a href={l.url} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
              {l.credit}
            </a>
            {i < looks.length - 1 ? " · " : ""}
          </span>
        ))}
      </p>
    </section>
  );
}
