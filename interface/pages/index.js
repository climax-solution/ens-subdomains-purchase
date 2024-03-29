import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {

  return (
    <div className={styles.container}>
      <Head>
        <title>ENS Express</title>
        <meta name="description" content="ENS Sub Domain Management" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <p className={styles.description}>
          <Image
            src="/logo.png"
            width="223"
            height="214"
            alt="logo"
          />
        </p>
      </main>
    </div>
  )
}
