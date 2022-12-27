import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
    return (
        <>
            <Head>
                <title>Simple Todo</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <div className="flex">Hello</div>
                {
                    // TODO: Need form for adding todos
                    // TODO: need list of current todos
                }
            </main>
        </>
    );
}
