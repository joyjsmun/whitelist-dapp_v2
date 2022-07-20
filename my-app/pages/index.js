import Head from 'next/head'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Whitelist dApp</title>
        <meta name="description" content='Whitelist-dApp' />
        <link rel="icon" href='/favicon.ico' />
      </Head>
      <div className='min-h-[90vh] flex flex-row justify-center items-center font-nato' id="main" >
        <div>
          <h1 className='font-bold font-nato'>Welcome to Crypto Devs!</h1>
        </div>
      </div>

    </div>
  )
}
