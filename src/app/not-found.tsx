import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section" style={{ paddingTop: "clamp(120px, 22vh, 180px)" }}>
      <div className="shell shell--narrow">
        <h1 className="display display--lg">Esta página não existe.</h1>
        <p className="lede mt-5">
          Deve ter sido um link antigo. O peixe continua todo na primeira
          página.
        </p>
        <Link className="btn btn--solid mt-8" href="/">
          Voltar ao início
        </Link>
      </div>
    </section>
  );
}
