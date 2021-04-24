import Head from 'next/head'
import utilStyles from '../styles/utils.module.css'
import dateFormat from 'dateformat'

export const siteTitle = 'Valor Dolar'

export async function getServerSideProps(context) {
    var now = new Date()
    now = dateFormat(now, 'mm-dd-yyyy')    
    const res = await fetch(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial='01-01-2021'&@dataFinalCotacao='${now}'&$top=100&$orderby=dataHoraCotacao%20desc&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`)
    const json = await res.json()
    now = dateFormat(now, 'dd/mm/yyyy')
    return {
        props: {
            value: json['value'][0].cotacaoCompra,
            value2: json['value'][0].cotacaoVenda,
            dateHoje: now
        }
    }
}

function Home(props) {
    return (
        <div className="container">
            <Head>
                <title>{siteTitle}</title>
                <meta name="viewport" content="width=device-width,initial-scale=1"/>

                <meta property="og:title" content={siteTitle} />
                <meta property="og:description" content="Site rapido e minimalista com valor atual do Dolar PTAX "/>
                <meta property="og-locale" content="pt_BR"/>       
                <meta property="og:site_name" content="Valor Dolar"/>
                <meta property="og:type" content="website"/>
                <meta property="og:url" content="https://dolar.vercel.app"/>
                <meta property="og:image" content="https://dolar.vercel.app/images/dolar.jpg"/>

                <meta name="twitter:card" content="summary_large_image"/>
                <meta name="twitter:title" content="Valor Dolar"/>
                <meta name="twitter:description" content="Site rapido e minimalista com valor atual do Dolar PTAX"/>
                <meta name="twitter:image" content="https://dolar.vercel.app/images/dolar.jpg"/>

                <meta name="apple-mobile-web-app-title" content="Valor Dolar"/>
                <meta name="application-name" content="Valor Dolar"/>
                <meta name="msapplication-TileColor" content="#2c6fda"/>/
                <meta name="theme-color" content="#ffffff"/>
            </Head>

            <main>
                <h2 className={utilStyles.heading2Xl}>Dolar PTAX - {props.dateHoje}</h2>
                <div>
                    <h3 className={utilStyles.headingLg}>Compra: R$ {props.value} </h3>
                </div>
                <div>
                    <h3 className={utilStyles.headingLg}>Venda: R$ {props.value2}</h3>
                </div>

            </main>

            <footer>
                <a href="https://github.com/luisely/dolar" target="_blank" rel="noopener noreferrer">Criado por Fernando Ely</a>
            </footer>
        </div>
    )
}



export default Home
