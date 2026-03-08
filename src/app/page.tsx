import Image from "next/image";
import styles from "./page.module.css";
import TimeBasedGradient from "../../components/background";

export default function Home() {
  return (
    <div className={styles.page}>
                <h1 className={styles.headline}>Josh Tregenza</h1>
      <main className={styles.main}>
        <div className={styles.imageArea}>
          <div className={styles.headImage}>
            <Image alt="Josh Image" width="500" height="600" src="/images/dithr-josh-2.PNG"/>
          </div>

        </div>
        <div className={styles.intro}>
          
          {/* <h1>To get started, edit the page.tsx file.</h1> */}
          <h2>designer. storyteller. craftsman.</h2>
          <p>As a designer, I start where most people don't: with the story underneath the brief. The visual problem is rarely the real problem. I go deeper until I find the thing that's actually broken, then build back up from there.</p>
          <p>As a storyteller, I believe the most durable brands aren't built on campaigns or aesthetics. They're built on narrative that runs through every decision, every touchpoint, every hire. Story isn't the output. It's the operating system.</p>
          <p>As a craftsman, I care about the work at the level where most people stop caring. The documentation nobody reads until they need it. The design system that holds together six months after handoff. The CSS architecture that still makes sense when someone new inherits it. That's where the real work lives.</p>
          <p>I've spent over ten years at the intersection of design, development, and product. I build teams that bridge those disciplines and actually talk to each other. I dig into technical debt, legacy systems, and tangled business processes because that's where the real constraints are, and constraints are where good design gets interesting. I write the guides. I run the workshops. I mentor the people who'll do this better than me.</p>
          <p>And I do all of it with the belief that the best work comes from cultures that are caring, a little quirky, and honest about what they're actually trying to build.</p>
        </div>
                
      </main>
          
    </div>

  );
}
